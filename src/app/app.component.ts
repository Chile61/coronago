import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BootService } from './services/boot.service';
import {CgAdvertisementScannerService} from './services/ble/cg-advertisement-scanner.service';
import {CgAdvertisementFactoryService} from './services/ble/cg-advertisement-factory.service';
import {CGAdvertisement} from './services/ble/cg-advertisement.class';

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

import {CdvBluetoothLeService} from './services/ble/cdv-bluetooth-le.service';
import to from 'await-to-js';
import {scan} from 'rxjs/operators';
import _ from 'lodash';
import {CgPeripheralManagerService} from './services/ble/cg-peripheral-manager.service';
import {CgPeripheral} from './services/ble/cg-peripheral.class';
import {CgUserManagerService} from './services/ble/cg-user-manager.service';
import {BleScanCycleManagerService} from './services/ble/ble-scan-cycle-manager.service';


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
        private bleScanCycleManagerService: BleScanCycleManagerService
    ) {
        this.bootService.initApp();



        this.bleScanCycleManagerService.startScanCycle();


        // setTimeout(this.configureBackgroundGeolocation,  5000);


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

            window.cordova.plugins.backgroundMode.enable();
            console.error('ffr', 'background mode requested!!');

        }, false);




        this.initializeApp();
    }

    initializeApp(): void {
        this.platform.ready().then(() => {
            this.statusBar.styleLightContent();
            this.splashScreen.hide();
        });
    }


}
