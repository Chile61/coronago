import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ReplaySubject } from 'rxjs';
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

        this.location$.subscribe((value) => {
            console.error('[hi i am here]: location', JSON.stringify(value));
        });

        this.motion$.subscribe((value) => {
            console.error('[hi i am here]: motion', JSON.stringify(value));
        });

        this.http$.subscribe((value) => {
            console.error('[hi i am here]: http', JSON.stringify(value));
        });

        this.providerChange$.subscribe((value) => {
            console.error('[hi i am here]: providerChange', JSON.stringify(value));
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

        BackgroundGeolocation.ready(
            {
                reset: true,
                debug: true,
                logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
                desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
                distanceFilter: 10,
                heartbeatInterval: 10,
                // url: 'http://my.server.com/locations',
                // autoSync: true,
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
