import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {CdvBluetoothLeService} from './cdv-bluetooth-le.service';
import {CdvBluetoothLeHelperService} from './cdv-bluetooth-le-helper.service';
import {CGAdvertisement} from './cg-advertisement.class';
import {CgServiceMatcherService} from './cg-service-matcher.service';
import to from 'await-to-js';
import {take} from 'rxjs/operators';
import _ from 'lodash';

const isIosPlatform = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = !isIosPlatform;

interface AdvResp {
    rssi: number;
    advertisement: {};
    address: string;
}


@Injectable({
  providedIn: 'root'
})
export class CgAdvertisementScannerService {

    private cgAdvertisementReceivedSubject$ = new Subject();
    public cgAdvertisementReceived$ = this.cgAdvertisementReceivedSubject$.asObservable();

    private cgScanCycleWorthOfScanRespsSubject$ = new Subject();
    public cgScanCycleWorthOfScanResps$ = this.cgScanCycleWorthOfScanRespsSubject$.asObservable();

    private scanBuffer = [];

    constructor() {

        // this.startScanningForCgAdvertisement();

    }

    async delayAsync(delayMs: number): Promise<any> {
        return new Promise( (resolve, reject) => {
            setTimeout(resolve, delayMs);
        });
    }

    // public connectWithTimeout() {
    //
    // }

    public async queryUserIdFromBleService(address): Promise<any> {

        // last 3 character als log  identifier
        const connFlowId = _.random(1, 100);
        const blePartnerId = address.slice(-3);


        const startTimeMs = Date.now();
        console.error('ffr', connFlowId, blePartnerId, 'connect attempt... ');
        let [err, msg] = await to( CdvBluetoothLeService.connect({
            address,
            autoConnect: false // android: Automatically connect as soon as the
                               // remote device becomes available
        }) );
        console.error('ffr', connFlowId, blePartnerId, 'connect response', JSON.stringify(err), JSON.stringify(msg));
        console.error('ffr', connFlowId, blePartnerId, `connect response time ${( (Date.now() - startTimeMs) / 1000 ).toFixed(0)}`, );


        if (!err) {
            [err, msg] = await to( CdvBluetoothLeService.discover({address}) );
            console.error('ffr', connFlowId, blePartnerId, 'discover response', JSON.stringify(err), JSON.stringify(msg));
        } else {
            console.error('ffr', connFlowId, blePartnerId, 'connection error. Wont discover');
        }


        [err, msg] = await to( CdvBluetoothLeService.disconnect({address}) );
        console.error('ffr', connFlowId, blePartnerId, 'disconnect', JSON.stringify(err), JSON.stringify(msg));

        [err, msg] = await to( CdvBluetoothLeService.close({address}) );
        console.error('ffr', connFlowId, blePartnerId, 'connect close response', JSON.stringify(err), JSON.stringify(msg));

        return msg;

    }

    public async startScanningForCgAdvertisement(): Promise<any> {

        console.error('ffr', 'start scanning for advertisement');

        await CdvBluetoothLeService.initialize();

        CdvBluetoothLeService.advReceived$
            .subscribe( async (advResp: AdvResp) => {
                const { address, rssi, advertisement: rawAdvResp } = advResp;
                this.stashScanResp(advResp);
            });

        this.startScanLoop();
    }

    private async startScanLoop(): Promise<any> {

        console.error('ffr', 'Start scan loop');

        let msg: any;
        let randPauseTimeMs;
        let scanLoopIdx = 1;
        const reInitAdapterOnEveryNthCycle = 5;
        const scanTimeMs = 2000;

        while (true) {

            scanLoopIdx += 1;

            try {

                // Fix for older android devices who seem to stop scanning
                // after certain
                if (isAndroid && (scanLoopIdx % reInitAdapterOnEveryNthCycle === 0)) {
                    // msg = await this.reInitBleAndroid(msg);
                }


                this.clearScanBuffer();
                msg = await CdvBluetoothLeService.startScan();
                console.error('ffr', 'startScan msg', JSON.stringify(msg));

                await this.delayAsync(scanTimeMs);

                msg = await CdvBluetoothLeService.stopScan();
                console.error('ffr', 'stopScan msg', JSON.stringify(msg));

                this.cgScanCycleWorthOfScanRespsSubject$.next(this.scanBuffer);

                // The pause inbetween scans needs to be random, in order to equal
                // the chances that a device is to connect to another device
                // randPauseTimeMs = _.random(40000, 80000); // avg 60sec
                randPauseTimeMs = _.random(10000, 16000); // avg 60sec
                console.error('ffr', 'stopScan pause time/sec',
                    `<${( randPauseTimeMs / 1000 ).toFixed(0)}>`);


                await this.delayAsync(randPauseTimeMs);


                // await this.waitingForGattServiceRequestsDone();

            } catch (e) {

                console.error('ffr', 'error in scan loop');
                console.error(e);
                console.error('ffr', 'error in scan loop');
            }

        }
    }

    private async reInitBleAndroid(msg: any) {
        console.error('ffr', 'REINIT ble adapter');

        msg = await CdvBluetoothLeService.disableBleAdapter();
        console.error('ffr', 'startScan msg', 'disable-adapter', JSON.stringify(msg));


        msg = await CdvBluetoothLeService.enableBleAdapter();
        console.error('ffr', 'startScan msg', 'enable-adapter', JSON.stringify(msg));

        // Sicherheitsabstand between enable und scan, system seems to be
        // for android devices
        await this.delayAsync(5000);

        msg = await CdvBluetoothLeService.hardInitialize();
        console.error('ffr', 'startScan msg', 'enable-adapter', JSON.stringify(msg));
        return msg;
    }

    private stashScanResp( scanResp ): void {
        this.scanBuffer.push(scanResp);
    }

    private clearScanBuffer(): void {
        this.scanBuffer = [];
    }


    // private async waitingForGattServiceRequestsDone() {
    //
    //
    //
    //
    // }


    private async waitingForGattServiceRequestsDone(): Promise<any> {

    }
}
