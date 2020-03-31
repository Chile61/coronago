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
        private cGAdvertisementScannerService: CgAdvertisementScannerService,
        private cGAdvertisementFactoryService: CgAdvertisementFactoryService,
        private cgPeripheralManagerService: CgPeripheralManagerService,
        private cgUserManagerService: CgUserManagerService,
    ) {
        this.bootService.initApp();


        setTimeout(async () => {
            this.cGAdvertisementFactoryService.startAdvertising();
        }, 3000);


        cgPeripheralManagerService.peripheralsUpdated$
            .subscribe(async ( periByAddr ) => {
                try {

                    console.error('ffr', '--------------------------------------------------');
                    console.error('ffr', 'PERIPHERALS');
                    console.error('ffr', '--------------------------------------------------');
                    _.each(periByAddr, (peri: CgPeripheral, addr) => {
                        console.error(
                            'ffr', 'peri#', addr,
                            'seen', peri.getLastSeenReadableSec(), 'secs ago',
                            JSON.stringify(peri), peri.getUserId());

                    });



                    console.error('ffr', '--------------------------------------------------');
                    console.error('ffr', 'DROP OLD PERIPHERAL ENTRIES');
                    console.error('ffr', '--------------------------------------------------');
                    const peris: CgPeripheral[] = _.values(periByAddr);
                    for (let i = 0, ii = peris.length; i < ii; i += 1) {
                        const peri = peris[i];
                        if (peri.isOlderThenMs(200 * 1000)) {
                            console.error('ffr', 'Dropping peripheral ', peri.address);
                            await cgPeripheralManagerService.dropPeripheralByAddress(peri.address);
                        }
                    }


                    console.error('ffr', '--------------------------------------------------');
                    console.error('ffr', 'RETRIEVING USER ID');
                    console.error('ffr', '--------------------------------------------------');
                    for (let i = 0, ii = peris.length; i < ii; i += 1) {
                        const peri = peris[i];
                        await peri.retrieveUserId();
                    }

                    console.error('ffr', '--------------------------------------------------');
                    console.error('ffr', 'USER STATUS CURRENT');
                    console.error('ffr', '--------------------------------------------------');


                    console.error('ffr', cgUserManagerService.getUsers(), JSON.stringify( cgUserManagerService.getUsers() ) );



                    // notifyPeripheralCycleDone

                    // _.each(periByAddr, (peri: CgPeripheral, addr) => {
                    //     if (!peri.didExtractUserId() ) {
                    //         console.error('ffr', 'Retrieving user id for ', addr , '...');
                    //         peri.retrieveUserId();
                    //     }
                    // });

                    // notifyPeripherCycleDone

                } catch (e) {
                    console.error('ffr', 'error', JSON.stringify(e));
                    console.error(e);
                }
            });


        cGAdvertisementScannerService.startScanningForCgAdvertisement();


        setInterval( async () => {
            const [err, advResponse] = await to(CdvBluetoothLeService.isAdvertising());
            console.error('frr', 'isAdvertising?', JSON.stringify(err), JSON.stringify(advResponse));
        }, 5000);




        cGAdvertisementScannerService.cgScanCycleWorthOfScanResps$
            .subscribe( async (scanResponses: []) => {
                console.error('ffr', 'scan responses coutn', scanResponses.length);

                if (scanResponses && scanResponses.length) {

                    let addrs = _.map(scanResponses, 'address');
                    addrs = _.uniq(addrs);
                    console.error('ffr', 'got scan responses', JSON.stringify(addrs));


                    cgPeripheralManagerService.feedWithScanResponses(scanResponses);

                }

            });





        // setTimeout(this.configureBackgroundGeolocation,  5000);


        document.addEventListener('deviceready', () => {
            // cordova.plugins.backgroundMode is now available

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
