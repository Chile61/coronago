import { Injectable } from '@angular/core';
import {CdvBluetoothLeService} from './cdv-bluetooth-le.service';
import to from 'await-to-js';
import {Subject} from 'rxjs';
import _ from 'lodash';


const isIosPlatform = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = !isIosPlatform;

@Injectable({
  providedIn: 'root'
})
export class CgAdvertisementFactoryService {


    private peripheralScanCycleFinishedSubject$ = new Subject();
    public peripheralScanCycleFinished$ = this.peripheralScanCycleFinishedSubject$.asObservable();


    constructor() {

        // Restart the advertisement after a ble-central disconnected
        if (isAndroid) {

            CdvBluetoothLeService.peripheralEventReceived$
                .subscribe( ({status: peripheralEvent}) => {

                    console.error('ffr', 'peri - event:', peripheralEvent);


                    if (peripheralEvent === 'connected') {

                        // this.restartAdvertisingDebounced();

                    }

                    if (peripheralEvent === 'disconnected') {

                        console.error('ffr', 'PERIEVENT disconnect detected');

                        this.restartAdvertisingDebounced();

                    }

                });

        }

        this.addService();

    }

    /**
     *
     */
    public async startAdvertising(): Promise<any> {

        await this.addService();

        console.error('ffr', 'factory', 'starting advertisement');
        await CdvBluetoothLeService.initializePeripheral();

        let [ err, dd ] = await to(CdvBluetoothLeService.stopAdvertising());
        console.error('ffr', 'stop advertising', JSON.stringify(err), JSON.stringify(dd));

        [ err, dd ] = await to(CdvBluetoothLeService.startAdvertising());
        console.error('ffr', 'start advertising', JSON.stringify(err), JSON.stringify(dd));

        return 'started advertising';
    }


    private restartAdvertisingDebounced = _.debounce( () => {
        this.restartAdvertising();
    }, 5000);


    /**
     *
     */
    private async restartAdvertising(): Promise<any> {

        console.error('ffr', 'Attempt restarting advertising');

        const msg = await this.startAdvertising();
        console.error('ffr', 'restart advertising', msg);
    }

    private async addService(): Promise<any> {

        let [err, msgGe] = await to(CdvBluetoothLeService.removeAllService());
        console.error('ffr', 'remove service', JSON.stringify(err), JSON.stringify(msgGe));

        [err, msgGe] = await to(CdvBluetoothLeService.addService());
        console.error('ffr', 'add service', JSON.stringify(err), JSON.stringify(msgGe));

    }
}
