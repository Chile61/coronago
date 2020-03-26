import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ReplaySubject } from 'rxjs';
import BackgroundGeolocation, {
    HeartbeatEvent,
    HttpEvent,
    Location,
    MotionActivityEvent,
    MotionChangeEvent,
    ProviderChangeEvent,
} from 'cordova-background-geolocation-lt';

export type BgLocation = Location;
export type BgMotion = MotionChangeEvent;
export type BgHttp = HttpEvent;
export type BgProviderChange = ProviderChangeEvent;
export type BgHeartbeat = HeartbeatEvent;
export type BgActivity = MotionActivityEvent;
export type BgPowerSave = boolean;

@Injectable({
    providedIn: 'root',
})
export class BackgroundGeolocationService {
    public backgroundGeolocationInitialized$ = new ReplaySubject<boolean>(1);

    public location$ = new ReplaySubject<BgLocation>(1);
    public motion$ = new ReplaySubject<BgMotion>(1);
    public http$ = new ReplaySubject<BgHttp>(1);
    public providerChange$ = new ReplaySubject<BgProviderChange>(1);
    public heartbeat$ = new ReplaySubject<BgHeartbeat>(1);
    public activity$ = new ReplaySubject<BgActivity>(1);
    public powerSave$ = new ReplaySubject<BgPowerSave>(1);

    constructor(private platform: Platform) {}

    /**
     * Init service
     */
    public init(): void {
        this.platform.ready().then(() => {
            this.startServices();
        });

        // DEBUG - can be removed
        this.location$.subscribe((value) => {
            console.error('[hi i am here]: location', value, JSON.stringify(value));
        });

        this.motion$.subscribe((value) => {
            console.error('[hi i am here]: motion', value, JSON.stringify(value));
        });

        this.http$.subscribe((value) => {
            console.error('[hi i am here]: http', value, JSON.stringify(value));
        });

        this.providerChange$.subscribe((value) => {
            console.error('[hi i am here]: providerChange', value, JSON.stringify(value));
        });

        this.heartbeat$.subscribe((value) => {
            console.error('[hi i am here]: heartbeat', value, JSON.stringify(value));
        });

        this.activity$.subscribe((value) => {
            console.error('[hi i am here]: activity', value, JSON.stringify(value));
        });

        this.powerSave$.subscribe((value) => {
            console.error('[hi i am here]: powerSave', value, JSON.stringify(value));
        });
    }

    /**
     * Start background location services
     */
    private startServices(): void {
        BackgroundGeolocation.onLocation((location) => {
            this.location$.next(location);
        });

        BackgroundGeolocation.onMotionChange((event) => {
            this.motion$.next(event);
        });

        BackgroundGeolocation.onHttp((response) => {
            this.http$.next(response);
        });

        BackgroundGeolocation.onProviderChange((event) => {
            this.providerChange$.next(event);
        });

        BackgroundGeolocation.onHeartbeat((event) => {
            this.heartbeat$.next(event);
        });

        BackgroundGeolocation.onActivityChange((event) => {
            this.activity$.next(event);
        });

        BackgroundGeolocation.onPowerSaveChange((event) => {
            this.powerSave$.next(event);
        });

        BackgroundGeolocation.ready(
            {
                reset: true,
                debug: false,
                logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
                desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
                distanceFilter: 10,
                heartbeatInterval: 60,
                // url: 'http://my.server.com/locations',
                // autoSync: true,
                stopOnTerminate: false,
                startOnBoot: true,
                // iOS
                preventSuspend: true,
                // Android
                enableHeadless: true,
                foregroundService: true,
                notification: {
                    title: 'Corona GO',
                    text: 'Deine Personen-Kontakte werden gezählt :)',
                    priority: BackgroundGeolocation.NOTIFICATION_PRIORITY_MIN,
                    color: '#d81b60',
                    channelName: 'Kontakt-Personen Zähler'
                }
            },
            (state) => {
                console.log('[ready] BackgroundGeolocation is ready to use');
                if (!state.enabled) {
                    // 3.  Start tracking.
                    BackgroundGeolocation.start();
                }
            }
        ).then(
            (r) => this.backgroundGeolocationInitialized$.next(true),
            (error) => this.backgroundGeolocationInitialized$.next(false)
        );
    }
}
