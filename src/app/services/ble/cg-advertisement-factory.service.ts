import { Injectable } from '@angular/core';
import {CdvBluetoothLeService} from './cdv-bluetooth-le.service';
import to from 'await-to-js';
import {Subject} from 'rxjs';
import _ from 'lodash';
import {FlagService} from '../flag.service';
import {take} from 'rxjs/operators';


const isIosPlatform = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = !isIosPlatform;

@Injectable({
  providedIn: 'root'
})
export class CgAdvertisementFactoryService {


    private peripheralScanCycleFinishedSubject$ = new Subject();
    public peripheralScanCycleFinished$ = this.peripheralScanCycleFinishedSubject$.asObservable();


    constructor(private flagService: FlagService) {

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

        this.startAdvertising();

    }

    /**
     *
     */
    public async startAdvertising(): Promise<any> {


        console.error('ffr', 'userid', 'Waiting for user-id');
        const cgUserId = await this.retrieveUserId();

        console.error('ffr', 'userid', 'Received user id', cgUserId);

        await this.addService(cgUserId);

        console.error('ffr', 'factory', 'starting advertisement');
        await CdvBluetoothLeService.initializePeripheral();





        let [ err, dd ] = await to(CdvBluetoothLeService.stopAdvertising());
        console.error('ffr', 'stop advertising', JSON.stringify(err), JSON.stringify(dd));

        [ err, dd ] = await to(CdvBluetoothLeService.startAdvertising());
        console.error('ffr', 'start advertising', JSON.stringify(err), JSON.stringify(dd));

        return 'started advertising';
    }


    private async retrieveUserId(): Promise<string> {
        return this.flagService.localUserId$
            .pipe(
                take(1)
            )
            .toPromise();
    }

    private restartAdvertisingDebounced = _.debounce( () => {
        this.restartAdvertising();
    }, 7000);


    /**
     *
     */
    private async restartAdvertising(): Promise<any> {

        console.error('ffr', 'Attempt restarting advertising');

        const msg = await this.startAdvertising();
        console.error('ffr', 'restart advertising', msg);
    }

    private async addService(cgUserId: string): Promise<any> {

        let [err, msgGe] = await to(CdvBluetoothLeService.removeAllService());
        console.error('ffr', 'remove service', JSON.stringify(err), JSON.stringify(msgGe));

        [err, msgGe] = await to(CdvBluetoothLeService.addService(cgUserId));
        console.error('ffr', 'add service', JSON.stringify(err), JSON.stringify(msgGe));

    }
}
