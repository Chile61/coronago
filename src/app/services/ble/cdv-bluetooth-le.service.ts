import {Subject} from 'rxjs';
import {CGAdvertisement} from './cg-advertisement.class';
import {Injectable} from '@angular/core';



/**
 *
 */

const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

/**
 * Wrapper for
 *
 * cordova-plugin-bluetoothle
 *
 * to transform api to promise-based
 *
 */

@Injectable({
    providedIn: 'root'
})
export class CdvBluetoothLeService {

    static isDeviceReady = new Promise((resolve, reject) => {
        document.addEventListener('deviceready', resolve);
    });

    static isBleInitialized = new Promise( (resolve, reject) => {

    });

    static async assertCordovaDeviceReady(): Promise<any> {
        return CdvBluetoothLeService.isDeviceReady;
    }

    /**
     *
     */
    static async initialize(): Promise<any> {

        await CdvBluetoothLeService.assertPreConditions();

        return new Promise((resolve, reject) => {

            const initParams = {
                request: true,
                restoreKey: 'coronago'
            };

            window.bluetoothle.initialize(
                resolve, initParams
            );

        });

    }

    static async assertPreConditions(): Promise<any> {

        await CdvBluetoothLeService.assertCordovaDeviceReady();

        // Requst ble permission explicitely on Android. check if htis i ths
        // necessary
        if (!isIos) {
            const reqPermResponse = await CdvBluetoothLeService.requestBlePermission();
            console.error('REQ_PERMI_RESP', reqPermResponse);
        }

    }

    static async requestLocation(): Promise <any> {

        return new Promise((resolve, reject) => {

            window.bluetoothle.requestLocation(resolve, reject);

        });

    }

    static async requestBlePermission(): Promise<any> {

        return new Promise((resolve, reject) => {

            window.bluetoothle.requestPermission(resolve, reject);

        });

    }

    static async startScan(): Promise<any> {

        await CdvBluetoothLeService.assertPreConditions();

        const advReceivedSubject$ = new Subject();
        const advReceived$ = advReceivedSubject$.asObservable();

        const scanParams = {
            allowDuplicates: true //iOS
        };

        window.bluetoothle.startScan(
            (obj) => {

                console.error('startScan', obj);

                if (obj.scanResult === 'scanStarted') {
                    console.error(obj);
                }

                if (obj.scanResult === 'scanResult') {
                    const adv = new CGAdvertisement(obj.advertisement, obj.rssi);
                    advReceivedSubject$.next(adv);
                }

            },
            (obj) => {
                console.error('startScan', obj);
                advReceivedSubject$.error(obj);
            },
            scanParams);

        return Promise.resolve(advReceived$);
    }

}
