import { Injectable } from '@angular/core';
import {CdvBluetoothLeService} from './cdv-bluetooth-le.service';

@Injectable({
  providedIn: 'root'
})
export class CgAdvertisementFactoryService {

    constructor() {

        // this.startAdvertising();
    }

    public async startAdvertising(): Promise<any> {

        console.error('factory', 'starting advertisement');

        const msg$ = await CdvBluetoothLeService.initializePeripheral();
        msg$.subscribe( periEvent => {
            console.error('start advertising', periEvent);
        });


        const dd = await CdvBluetoothLeService.stopAdvertising();
        console.error('stop advertising', dd);

        const advMsg = await CdvBluetoothLeService.startAdvertising();
        console.error('start advertising', advMsg);

    }
}
