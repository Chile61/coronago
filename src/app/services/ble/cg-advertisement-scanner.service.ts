import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {CdvBluetoothLeService} from "./cdv-bluetooth-le.service";
import {CdvBluetoothLeHelperService} from "./cdv-bluetooth-le-helper.service";

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


    private async startScanningForCgAdvertisement(): Promise<any> {

        await CdvBluetoothLeService.initialize();

        const advReceived$ = await CdvBluetoothLeService.startScan();

        advReceived$
            .subscribe( cgAdv => {

                try{

                    // const advBase64 = obj.advertisement;
                    // const advHexStr = CdvBluetoothLeHelperService.base64ToHex(advBase64);
                    // const advIntArray = window.bluetoothle.encodedStringToBytes(advBase64);

                    console.error( cgAdv);
                    // console.error(advIntArray);


                } catch (e) {

                }

            });

    }

}
