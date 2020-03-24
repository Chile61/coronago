import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {CdvBluetoothLeService} from "./cdv-bluetooth-le.service";
import {CdvBluetoothLeHelperService} from "./cdv-bluetooth-le-helper.service";


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
            .subscribe( cgAdv => {

                try{

                    if (isIos) {

                    } else {

                    }

                    // const advBase64 = obj.advertisement;
                    // const advHexStr = CdvBluetoothLeHelperService.base64ToHex(advBase64);
                    // const advIntArray = window.bluetoothle.encodedStringToBytes(advBase64);

                    // console.error( cgAdv);
                    // console.error(advIntArray);

                    this.cgAdvertisementReceivedSubject$.next(cgAdv);

                } catch (e) {

                }

            });


        let msg: any;
        while (true) {

            msg = await CdvBluetoothLeService.startScan();
            console.error('startScan msg', msg);

            await this.delayAsync(3000);

            msg = await CdvBluetoothLeService.stopScan();
            console.error('stopScan msg', msg);

            await this.delayAsync(10000);

        }


    }

}
