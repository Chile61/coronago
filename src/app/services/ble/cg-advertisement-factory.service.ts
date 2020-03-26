import { Injectable } from '@angular/core';
import {CdvBluetoothLeService} from './cdv-bluetooth-le.service';

@Injectable({
  providedIn: 'root'
})
export class CgAdvertisementFactoryService {

    constructor() {

        // this.startAdvertising();
    }

    public static async startAdvertising(): Promise<any> {

        console.error('ffr', 'factory', 'starting advertisement');
        const msg$ = await CdvBluetoothLeService.initializePeripheral();
        msg$.subscribe( periEvent => {
            console.error('ffr', 'start advertising', periEvent);
        });

        const dd = await CdvBluetoothLeService.stopAdvertising();
        console.error('ffr', 'stop advertising', dd);

        const advMsg = await CdvBluetoothLeService.startAdvertising();
        console.error('ffr', 'start advertising', advMsg);

        return 'done';
    }

}
