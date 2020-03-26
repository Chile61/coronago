import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {CdvBluetoothLeService} from './cdv-bluetooth-le.service';
import {CdvBluetoothLeHelperService} from './cdv-bluetooth-le-helper.service';
import {CGAdvertisement} from './cg-advertisement.class';
import {CgServiceMatcherService} from './cg-service-matcher.service';


const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);




@Injectable({
  providedIn: 'root'
})
export class CgAdvertisementScannerService {

    private cgAdvertisementReceivedSubject$ = new Subject();
    public cgAdvertisementReceived$ = this.cgAdvertisementReceivedSubject$.asObservable();

    constructor() {

        // setTimeout( () => {
        //     this.cgAdvertisementReceivedSubject$.next('TESTTEST');
        // }, 4000);


        this.startScanningForCgAdvertisement();

    }


    async delayAsync(delayMs: number): Promise<any> {
        return new Promise( (resolve, reject) => {
            setTimeout(resolve, delayMs);
        });
    }


    private async startScanningForCgAdvertisement(): Promise<any> {

        await CdvBluetoothLeService.initialize();



        CdvBluetoothLeService.advReceived$
            .subscribe( ({ rssi, advertisement: rawAdvResp }) => {

                try{

                    // console.error('raw-adv', rawAdvResp);

                    const serviceUuidByteArray = CdvBluetoothLeHelperService.extractServiceUuidByteArrayFromAdvResp(rawAdvResp);

                    if (serviceUuidByteArray) {

                        // console.error('raw-adv-service-id-extracted', serviceUuidByteArray);

                        const uuidByteArray = CgServiceMatcherService.matchServiceUuidReturnUser(serviceUuidByteArray);

                        const cgAdv = new CGAdvertisement(uuidByteArray, rssi, rawAdvResp);

                        this.cgAdvertisementReceivedSubject$.next(cgAdv);

                    }


                } catch (e) {

                    console.error('error', e);
                }



            });


        let msg: any;
        const scanTimeMs = 3000;
        const pauseTimeMs = 10000;
        while (true) {

            msg = await CdvBluetoothLeService.startScan();
            console.error('startScan msg', msg);

            await this.delayAsync(scanTimeMs);

            msg = await CdvBluetoothLeService.stopScan();
            console.error('stopScan msg', msg);

            await this.delayAsync(pauseTimeMs);

        }


    }

}
