import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import BackgroundGeolocation from 'cordova-background-geolocation-lt';

interface BgLocation {}

interface BgMotion {}

interface BgHttp {}

interface BgProviderChange {}

@Injectable({
    providedIn: 'root',
})
export class BackgroundGeolocationService {
    public location$ = new ReplaySubject<BgLocation>(1);
    public motion$ = new ReplaySubject<BgMotion>(1);
    public http$ = new ReplaySubject<BgHttp>(1);
    public providerChange$ = new ReplaySubject<BgProviderChange>(1);
    public backgroundGeolocationInitialized$ = new ReplaySubject<boolean>(1);

    constructor(private platform: Platform) {}

    /**
     * Init service
     */
    public init(): void {
        this.platform.ready().then(() => {
            this.startServices();
        });
    }

    /**
     * Start background location services
     */
    private startServices(): void {
        BackgroundGeolocation.onLocation((location) => {
            console.log('[location] - ', location);
            this.location$.next(location);
        });

        BackgroundGeolocation.onMotionChange((event) => {
            console.log('[motionchange] - ', event.isMoving, event.location);
            this.motion$.next(event);
        });

        BackgroundGeolocation.onHttp((response) => {
            console.log('[http] - ', response.success, response.status, response.responseText);
            this.http$.next(response);
        });

        BackgroundGeolocation.onProviderChange((event) => {
            console.log('[providerchange] - ', event.enabled, event.status, event.gps);
            this.providerChange$.next(event);
        });

        BackgroundGeolocation.ready(
            {
                reset: true,
                debug: true,
                logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
                desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
                distanceFilter: 10,
                url: 'http://my.server.com/locations',
                autoSync: true,
                stopOnTerminate: false,
                startOnBoot: true,
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
