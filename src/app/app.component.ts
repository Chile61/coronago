import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BootService } from './services/boot.service';

// You may import any optional interfaces
// import BackgroundGeolocation, {
//     State,
//     Config,
//     Location,
//     LocationError,
//     Geofence,
//     HttpEvent,
//     MotionActivityEvent,
//     ProviderChangeEvent,
//     MotionChangeEvent,
//     GeofenceEvent,
//     GeofencesChangeEvent,
//     HeartbeatEvent,
//     ConnectivityChangeEvent
// } from 'cordova-background-geolocation-lt';


import {BleScanCycleManagerService} from './services/ble/ble-scan-cycle-manager.service';
import {CgAdvertisementFactoryService} from './services/ble/cg-advertisement-factory.service';
import {CgUserManagerService} from './services/ble/cg-user-manager.service';
import to from 'await-to-js';
import {CdvBluetoothLeService} from './services/ble/cdv-bluetooth-le.service';
import _ from 'lodash';
import {CgUser} from './services/ble/cg-user.class';


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
        private bleScanCycleManagerService: BleScanCycleManagerService,
        private cGAdvertisementFactoryService: CgAdvertisementFactoryService,
        private cgUserManagerService: CgUserManagerService

    ) {
        this.bootService.initApp();


        setInterval( async () => {
            const [err, advResponse] = await to(CdvBluetoothLeService.isAdvertising());
            console.error('ffr', 'isAdvertising?', JSON.stringify(err), JSON.stringify(advResponse));
        }, 5000);


        this.cgUserManagerService.nearbyUserListUpdated$
            .subscribe((cgUsers: CgUser[]) => {

                console.error('ffr', '--------------------------------------------------');
                console.error('ffr', 'NEARBY USER STATUS UPDATED');
                console.error('ffr', '--------------------------------------------------');

                const usersReadable = _.map(cgUsers, (cgu: CgUser) => {
                    return {
                        ... _.pick(cgu, [ 'userUuId', 'lastSeenRssi' ]),
                        lastSeenSecs: cgu.getLastSeenReadableSec()
                    };
                });

                console.error('ffr', usersReadable, JSON.stringify(usersReadable) );
            });



        /**
         * Advertising
         */
        this.cGAdvertisementFactoryService.initPeripheralAdvertising();



        /**
         * Scanning
         */
        this.bleScanCycleManagerService.startScanCycle();










        document.addEventListener('deviceready', () => {

            // cordova.plugins.backgroundMode is now available

            // window.cordova.plugins.backgroundMode.setDefaults({
            //     title: String,
            //     text: String,
            //     icon: 'icon' // this will look for icon.png in platforms/android/res/drawable|mipmap
            //     color: String // hex format like 'F14F4D'
            //     resume: Boolean,
            //     hidden: Boolean,
            //     bigText: Boolean
            // });

            window.cordova.plugins.backgroundMode.disable();
            console.error('ffr', 'background mode requested!!');


            // this.configureBackgroundGeolocation();



        }, false);


        // Like any Cordova plugin, you must wait for Platform.ready() before referencing the plugin.









        this.initializeApp();
    }

    initializeApp(): void {
        this.platform.ready().then(() => {
            this.statusBar.styleLightContent();
            this.splashScreen.hide();
        });
    }


    // configureBackgroundGeolocation(): void {
    //
    //     // 1.  Listen to events.
    //     BackgroundGeolocation.onLocation(location => {
    //         console.error('ffr', 'bg', '[location] - ', location);
    //     });
    //
    //     BackgroundGeolocation.onMotionChange(event => {
    //         console.error('ffr', 'bg', '[motionchange] - ', event.isMoving, event.location);
    //     });
    //
    //     BackgroundGeolocation.onHttp(response => {
    //         console.error('ffr', 'bg', '[http] - ', response.success, response.status, response.responseText);
    //     });
    //
    //     BackgroundGeolocation.onProviderChange(event => {
    //         console.error('ffr', 'bg', '[providerchange] - ', event.enabled, event.status, event.gps);
    //     });
    //
    //     BackgroundGeolocation.onHeartbeat(event => {
    //         console.error('ffr', 'bg', '[heartbeat] - ', JSON.stringify(event));
    //     });
    //
    //     // 2.  Configure the plugin with #ready
    //     BackgroundGeolocation.ready({
    //         reset: true,
    //         debug: true,
    //         logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
    //         desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    //         distanceFilter: 10,
    //
    //         // url: 'http://my.server.com/locations',
    //         // autoSync: true,
    //
    //         stopOnTerminate: false,
    //
    //         startOnBoot: true,
    //
    //         disableStopDetection: true,
    //
    //         disableMotionActivityUpdates: true,
    //
    //         heartbeatInterval: 60, // sec
    //
    //         preventSuspend: true,  // iOS
    //
    //         foregroundService: true,
    //
    //         enableHeadless: true
    //
    //     }, (state) => {
    //         console.log('[ready] BackgroundGeolocation is ready to use');
    //         if (!state.enabled) {
    //             // 3.  Start tracking.
    //             BackgroundGeolocation.start();
    //         }
    //     });
    // }


}
