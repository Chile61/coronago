import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BootService } from './services/boot.service';
import {CgAdvertisementScannerService} from './services/ble/cg-advertisement-scanner.service';
import {CgAdvertisementFactoryService} from './services/ble/cg-advertisement-factory.service';
import {CGAdvertisement} from './services/ble/cg-advertisement.class';

// You may import any optional interfaces
import BackgroundGeolocation, {
    State,
    Config,
    Location,
    LocationError,
    Geofence,
    HttpEvent,
    MotionActivityEvent,
    ProviderChangeEvent,
    MotionChangeEvent,
    GeofenceEvent,
    GeofencesChangeEvent,
    HeartbeatEvent,
    ConnectivityChangeEvent
} from 'cordova-background-geolocation-lt';
import {CdvBluetoothLeService} from './services/ble/cdv-bluetooth-le.service';
import to from 'await-to-js';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private bootService: BootService,
        private cGAdvertisementScannerService: CgAdvertisementScannerService
        // private cGAdvertisementFactoryService: CgAdvertisementFactoryService
    ) {
        this.bootService.initApp();


        cGAdvertisementScannerService.cgAdvertisementReceived$
            .subscribe( ( cgAdv: CGAdvertisement ) => {
                console.error('ffr', 'KLABBET', cgAdv.uuid, cgAdv.rawAdvResp);
            });

        setTimeout(async () => {
            CgAdvertisementFactoryService.startAdvertising();
        }, 3000);



        setTimeout(this.configureBackgroundGeolocation,  5000);


        this.initializeApp();
    }

    initializeApp(): void {
        this.platform.ready().then(() => {
            this.statusBar.styleLightContent();
            this.splashScreen.hide();
        });
    }

    // Like any Cordova plugin, you must wait for Platform.ready() before referencing the plugin.
    configureBackgroundGeolocation(): void {

        // 1.  Listen to events.
        BackgroundGeolocation.onLocation(location => {
            console.error('ffr', '[location] - ', location);
        });

        // 1.  Listen to events.
        BackgroundGeolocation.onHeartbeat(async (heartbeat) => {
            console.error('ffr', '[heartbeat] - ', heartbeat);

            const [err, msg] = await to(CdvBluetoothLeService.isAdvertising());
            // const msg = await CgAdvertisementFactoryService.isAdvertising();
            console.error('ffr', 'heartbeat', JSON.stringify(msg), JSON.stringify(err));
        });

        BackgroundGeolocation.onMotionChange(event => {
            console.error('ffr', '[motionchange] - ', event.isMoving, event.location);
        });

        BackgroundGeolocation.onHttp(response => {
            console.error('ffr', '[http] - ', response.success, response.status, response.responseText);
        });

        BackgroundGeolocation.onProviderChange(event => {
            console.error('ffr', '[providerchange] - ', event.enabled, event.status, event.gps);
        });

        // 2.  Configure the plugin with #ready
        BackgroundGeolocation.ready({

            // debugging
            reset: true,
            debug: true,
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,

            locationAuthorizationRequest: 'Always',
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 10,

            // server config
            // url: 'http://my.server.com/locations',
            // autoSync: true,         // with server


            stopOnTerminate: false, // continue tracking after user terminates app
            startOnBoot: true,      // enable background-tracking after the device boots

            preventSuspend: true,   // Prevent iOS from suspending your application
                                    // in the background after location-services have been switched off
            heartbeatInterval: 10   // seconds

            // Android Switches
            //foregroundService:	Boolean	Default: false. Set true to make the plugin mostly immune to OS termination due to memory pressure from other apps.
            //enableHeadless:	Boolean	Default: false. Set to true to enable "Headless" mode when the user terminates the application. In this mode, you can respond to all the plugin's events in the native Android environment. For more information, see the wiki for Android Headless Mode


        }, (state) => {
            console.error('[ready] BackgroundGeolocation is ready to use');
            if (!state.enabled) {
                // 3.  Start tracking.
                BackgroundGeolocation.start();
            }
        });
    }


}
