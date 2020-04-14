import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {CgPeripheral} from './cg-peripheral.class';
import _ from 'lodash';
import {CgUserManagerService} from './cg-user-manager.service';


// TODO
export interface ScanResponse {
    rssi: number;
    address: string;
    advertisement: any;
}

@Injectable({
  providedIn: 'root'
})
export class CgPeripheralManagerService {

    // private peripherals: CgPeripheral[] = [];
    private peripheralsByAddr = {};

    private peripheralsUpdatedSubject$ = new Subject();
    public peripheralsUpdated$ = this.peripheralsUpdatedSubject$.asObservable();

    constructor(
        private cgUserManagerService: CgUserManagerService
    ) { }

    public feedWithScanResponses(scanResps: ScanResponse[]): void {

        if (!scanResps || scanResps.length === 0) {
            console.error('ffr', 'Empty scan-responses');
            return;
        }



        const scanRespsByAddr: {} = _.groupBy(scanResps, 'address');

        const cgPeripheralsReceived = _.map(scanRespsByAddr, (srs, addr) => {

            const cgPeri = this.retrieveOrCreatePeripheralByAddr(addr);

            cgPeri.updateViaScanResp(srs);

            return cgPeri;
        });




        this.peripheralsUpdatedSubject$.next({
            allPeripherals: this.peripheralsByAddr,
            cgPeripheralsReceivedInLastScan: cgPeripheralsReceived
        });


    }

    public async dropPeripheralByAddress(periAddress: string): Promise<any> {

        const peripheral = this.peripheralsByAddr[periAddress];

        await peripheral.cleanUp();

        delete this.peripheralsByAddr[periAddress];
    }


    private retrieveOrCreatePeripheralByAddr(periAddress: string): CgPeripheral {

        let peripheral = this.peripheralsByAddr[periAddress];

        if (!peripheral) {
            peripheral = new CgPeripheral(periAddress, this.cgUserManagerService);
            this.peripheralsByAddr[periAddress] = peripheral;
        }

        return peripheral;
    }


}
