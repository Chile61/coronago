import { Injectable } from '@angular/core';
import {CdvBluetoothLeService} from './cdv-bluetooth-le.service';
import to from 'await-to-js';
import {Subject} from 'rxjs';
import _ from 'lodash';
import {FlagService} from '../flag.service';
import {filter, take} from 'rxjs/operators';


const isIosPlatform = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = !isIosPlatform;

@Injectable({
  providedIn: 'root'
})
export class CgAdvertisementFactoryService {


    private peripheralScanCycleFinishedSubject$ = new Subject();
    public peripheralScanCycleFinished$ = this.peripheralScanCycleFinishedSubject$.asObservable();


    constructor(private flagService: FlagService) {


        this.flagService.localUserId$
            .subscribe( userId => {
                console.error('ffr', 'RECEIVED', 'RECEIVED new user id', userId);
                this.initGattService();
            });

    }

    public async initPeripheralAdvertising(): Promise<any> {


        await this.initGattService();

        if (isAndroid) {
            this.restartAdvertisementOnDisconects();
        }

        this.startAdvertising();
    }


    private restartAdvertisementOnDisconects(): void {

        console.error('ffr', 'ANDROID, register: restart advertisements on disconnect');

        CdvBluetoothLeService.peripheralEventReceived$
            .subscribe(({status: peripheralEvent}) => {

                console.error('ffr', 'peri - event:', peripheralEvent);

                if (peripheralEvent === 'connected') {
                    // this.restartAdvertisingDebounced();
                }

                if (peripheralEvent === 'disconnected') {

                    console.error('ffr', 'PERIEVENT disconnect detected, Restart advertising debounced ...');

                    this.restartAdvertisingDebounced();

                }

            });
    }

    /**
     *
     */
    public async startAdvertising(): Promise<any> {


        console.error('ffr', 'factory', 'starting advertisement');
        await CdvBluetoothLeService.initializePeripheral();






        let [ err, dd ] = await to(CdvBluetoothLeService.stopAdvertising());
        console.error('ffr', 'stop advertising', JSON.stringify(err), JSON.stringify(dd));

        [ err, dd ] = await to(CdvBluetoothLeService.startAdvertising());
        console.error('ffr', 'start advertising', JSON.stringify(err), JSON.stringify(dd));

        return 'started advertising';
    }

    public async retrieveUserId(): Promise<any> {
        return this.flagService.localUserId$
            .pipe(
                filter(k => !!k),
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

    private async initGattService(): Promise<any> {

        console.error('ffr', 'factory', 'starting advertisement');
        await CdvBluetoothLeService.initializePeripheral();


        console.error('ffr', 'userid', 'Waiting for user-id');
        const cgUserId = await this.retrieveUserId();

        console.error('ffr', 'userid', 'Received user id', cgUserId);

        return await this.addService(cgUserId);
    }
}
