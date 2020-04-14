import { Injectable } from '@angular/core';
import { CordovaPlugin } from './cordova-plugin';
import { Platform } from '@ionic/angular';
import { LogManager } from './log.service';
import { BackgroundGeolocationPlugin, Location } from '@mauron85/cordova-plugin-background-geolocation';
import { LocalNotificationService } from './local-notification.service';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';
import { to } from 'await-to-js';
import { interval, timer } from 'rxjs';
import { GeolocationService } from './geolocation/geolocation.service';
import { timeout } from 'rxjs/operators';

declare const BackgroundGeolocation: BackgroundGeolocationPlugin;

@Injectable({
    providedIn: 'root',
})
export class BackgroundGeolocationService extends CordovaPlugin {
    private log = new LogManager('BackgroundGeolocationService');
    protected cordovaPlugin: BackgroundGeolocationPlugin;
    public locationHistoryStorageKey = 'locationHistory';
    public lastNotificationLocationStorageKey = 'lastNotificationLocation';

    /**
     * 50m = 1/111111 * 50 = 0.00045
     * For simpler values, lon/lat are multiplied with 10^4
     */
    private samePlaceLocationThreshold = 4.5;

    /**
     * 80% of considered locations must be in the same area
     * (see: hasSmallLocationDiff, samePlaceLocationThreshold)
     */
    private sameLocationHistoryPercentage = 0.8;

    /**
     * [min] Time to stay in location until it is considered as settled
     */
    private newLocationStayTimeMin = 10;

    /**
     * Interval how the plugin should check the location
     */
    private locationUpdateIntervalMs = environment.production ? 60000 : 10000;

    constructor(
        private platform: Platform,
        private storage: Storage,
        private localNotificationService: LocalNotificationService,
        private geolocationService: GeolocationService
    ) {
        super();
        try {
            this.cordovaPlugin = BackgroundGeolocation;
        } catch (e) {}
        this.pluginName = 'BackgroundGeolocation';
    }

    public async init(): Promise<void> {
        await this.platform.ready();

        if (!this.isPluginAvailable()) {
            return;
        }

        await this.do();
    }

    private async do(): Promise<void> {
        this.setConfig();
        this.setOnLocation();
        this.setOnStationary();
        this.setOnError();
        this.setOnStart();
        this.setOnStop();
        this.cordovaPlugin.start();
        this.startIntervalCheckParkingPosition();
    }

    /**
     * Set plugin config
     * ! Important: If config has error, the whole config will be rejected!
     */
    private setConfig(): void {
        this.cordovaPlugin.configure({
            // notificationTitle: 'Immer sicher mit CORONA GO',
            // notificationText: 'Die App scannt im Hintergrund...',
            notificationTitle: 'Die App scannt im Hintergrund',
            notificationText: null,
            notificationIconColor: '#d81b60',
            notificationIconLarge: 'notification',
            notificationIconSmall: 'notification',
            locationProvider: this.cordovaPlugin.DISTANCE_FILTER_PROVIDER,
            desiredAccuracy: this.cordovaPlugin.HIGH_ACCURACY,
            stationaryRadius: 10, // [m] When stopped, the minimum distance the device must move beyond the stationary location
            distanceFilter: 10, // [m] The minimum distance a device must move horizontally before an update event is generated
            stopOnStillActivity: false, // @deprecated
            // activityType: 'Fitness', // ios
            pauseLocationUpdates: false, // ios
            saveBatteryOnBackground: false, // ios
            stopOnTerminate: false,
            startOnBoot: true, // android
            startForeground: true, // android
            // debug: environment.production ? false : true,
            debug: false,
            interval: this.locationUpdateIntervalMs, // location update interval
            fastestInterval: 1000 * 60, // activity only
            activitiesInterval: 1000 * 60, // activity only
        });
    }

    /**
     * Set on service start
     */
    private setOnStart(): void {
        this.cordovaPlugin.on('start', () => {
            this.log.warn('setOnStart', 'EVENT: <start>');
        });
    }

    /**
     * Set on service stop
     */
    private setOnStop(): void {
        this.cordovaPlugin.on('stop', () => {
            this.log.warn('setOnStop', 'EVENT: <stop>');
        });
    }

    /**
     * Handle on error
     */
    private setOnError(): void {
        this.cordovaPlugin.on('error', (error) => {
            this.log.error('setOnError', 'EVENT: <error>', error.code, error.message);
        });
    }

    /**
     * Handle on location
     */
    private setOnLocation(): void {
        this.cordovaPlugin.on('location', (location) => {
            this.log.error('setOnLocation', 'EVENT: <location>', location);
            this.createAsyncBackgroundTask(this.storeLocation(location));
        });
    }

    /**
     * Handle on stationary
     */
    private setOnStationary(): void {
        this.cordovaPlugin.on('stationary', (stationaryLocation) => {
            this.log.warn('setOnStationary', 'EVENT: <stationary>', location);
        });
    }

    /**
     * Handle on app background
     */
    private setOnBackground(): void {
        this.cordovaPlugin.on('background', () => {
            this.log.warn('setOnBackground', 'EVENT: <background>');
        });
    }

    /**
     * Handle on app foreground
     */
    private setOnForeground(): void {
        this.cordovaPlugin.on('foreground', () => {
            this.log.warn('setOnForeground', 'EVENT: <foreground>');
        });
    }

    /**
     * to perform long running operation on iOS you need to create background task on location update
     * execute long running task, eg. ajax post location
     * IMPORTANT: task has to be ended by endTask
     */
    private createAsyncBackgroundTask<T>(executingTask: Promise<any>): void {
        if (this.platform.is('ios')) {
            this.cordovaPlugin.startTask(async (taskKey) => {
                await executingTask;
                this.cordovaPlugin.endTask(taskKey);
            });
        } else {
            executingTask.then(() => {});
        }
    }

    /**
     * Store new location on update
     */
    private async storeLocation(location: Location): Promise<void> {
        let error = null,
            history: Location[] = null;
        [error, history] = await to(this.storage.get(this.locationHistoryStorageKey));
        if (error) {
            this.log.error('storeLocation', 'Failed to load location history');
        } else {
            this.log.log('storeLocation', 'Loaded location history', history);
        }

        // Add new location to stack
        if (!(history instanceof Array)) {
            history = [];
        } else {
            history.push(location);
            history = history.splice(environment.production ? -20 : -100); // Keep only last 20 for prod, 100 for dev
            this.checkSettledLocationChanged(history);
        }
        await this.storage.set(this.locationHistoryStorageKey, history);
        this.log.warn('storeLocation', 'Location History updated');
    }

    /**
     * Check if location is new and user should be notified about re-scan
     */
    private async checkSettledLocationChanged(history: Location[]): Promise<void> {
        // Skip if not enough data collected
        if (history.length < this.newLocationStayTimeMin) {
            return;
        }
        const lastLocation = history.slice(-1)[0];
        const historyLocations = history.slice(0, -1);

        // Only the history of the last this.newLocationStayTimeMin min is useful to compare
        const maxTime = this.newLocationStayTimeMin * 60 * 1000;
        let targetLocations = historyLocations.filter((loc) => Date.now() - loc.time < maxTime);

        // Keep last position if no results for last 10 min (so it should not have moved)
        if (!targetLocations.length) {
            targetLocations = historyLocations.slice(-1);
        }

        let nearbyLocations = 0;
        targetLocations.forEach((location) => {
            if (this.hasSmallLocationDiff(location, lastLocation)) {
                nearbyLocations++;
            }
        });

        const percentage = nearbyLocations / targetLocations.length;
        this.log.log(
            'checkSettledLocationChanged',
            'Location equal percentage',
            percentage,
            'of',
            this.sameLocationHistoryPercentage
        );

        if (percentage >= this.sameLocationHistoryPercentage) {
            this.notifyIfNecessary(lastLocation);
        } else {
            this.log.log('checkSettledLocationChanged', 'Location unchanged');
        }
    }

    /**
     * Check current location has significant change to last notification location
     */
    private async notifyIfNecessary(lastLocation: Location): Promise<void> {
        let keepSilence = false;
        const lastNotificationLocation = await this.storage.get(this.lastNotificationLocationStorageKey);
        if (lastNotificationLocation) {
            keepSilence = this.hasSmallLocationDiff(lastNotificationLocation, lastLocation);
        }
        if (!keepSilence) {
            this.localNotificationService.notifyNewLocation();
            await this.storage.set(this.lastNotificationLocationStorageKey, lastLocation);
        } else {
            this.log.log('notifyIfNecessary', 'Keep silence');
        }
    }

    /**
     * Location has significant change at 4th decimal place of coordinate
     * Threshold: absolute value of diff <= 5
     */
    private hasSmallLocationDiff(location: Location, lastLocation: Location): boolean {
        const { lonDiff, latDiff } = this.getLocationDiff(location, lastLocation);
        if (!lonDiff || !latDiff) {
            return false;
        }
        return !!(lonDiff <= this.samePlaceLocationThreshold && latDiff <= this.samePlaceLocationThreshold);
    }

    /**
     * Get the difference between 2 locations, scaled to 10^4
     */
    public getLocationDiff(location: Location, lastLocation: Location): { lonDiff: number; latDiff: number } {
        if (!location || !lastLocation) {
            return null;
        }

        const preLon = Math.round(location.longitude * 10000);
        const lasLon = Math.round(lastLocation.longitude * 10000);
        const preLat = Math.round(location.latitude * 10000);
        const lasLat = Math.round(lastLocation.latitude * 10000);
        const lonDiff = Math.abs(preLon - lasLon);
        const latDiff = Math.abs(preLat - lasLat);
        return { lonDiff, latDiff };
    }

    /**
     * Manually check phone parking position
     * Usually location check is only triggered by a GPS location change
     * But phone stays in place, there is no trigger
     * this will fix it
     */
    private startIntervalCheckParkingPosition(): void {
        timer(0, 60000).subscribe(async () => {
            this.log.log('startIntervalCheckParkingPosition', 'Manually checking if parking position');

            let locationHistory = await this.storage.get(this.locationHistoryStorageKey);
            this.log.log('startIntervalCheckParkingPosition', 'Loaded history', locationHistory);

            if (!(locationHistory instanceof Array)) {
                locationHistory = [];
            }

            this.checkLocationInterpolationRequired(locationHistory);
            this.checkSettledLocationChanged(locationHistory);
        });
    }

    /**
     * If device stays in same place, no location update
     * event will fire. It is useful to add location manually
     * to history, to keep app working if person not breaking
     * the zone
     */
    private checkLocationInterpolationRequired(locationHistory: Location[]): void {
        let lastLocation: Location, lastTime: number, timeDiff: number, hasTimeDiff: boolean;

        if (locationHistory instanceof Array && locationHistory.length) {
            lastLocation = locationHistory.slice(-1)[0];
            lastTime = lastLocation.time;
            timeDiff = Date.now() - lastTime;
            hasTimeDiff = timeDiff > this.locationUpdateIntervalMs + 5000;
        }

        // Interpolate, if last location older than update interval + tolerance
        if (hasTimeDiff || !lastLocation) {
            this.log.log('checkLocationInterpolationRequired', 'Adding location in cycled location check');
            const interpolatedLocation: Location = {
                time: Date.now(),
                latitude: null,
                longitude: null,
                id: -1337, // Required as identifier
                accuracy: null,
                altitude: null,
                bearing: null,
                isFromMockProvider: null,
                locationProvider: null,
                mockLocationsEnabled: null,
                provider: null,
                speed: null,
            };

            this.geolocationService
                .getGeoLocation()
                .pipe(timeout(5000))
                .subscribe(
                    (pos) => {
                        interpolatedLocation.latitude = pos.coords.latitude;
                        interpolatedLocation.longitude = pos.coords.longitude;

                        this.storeLocation(interpolatedLocation);
                    },
                    () => {
                        this.storeLocation(interpolatedLocation);
                    }
                );
        }
    }
}
