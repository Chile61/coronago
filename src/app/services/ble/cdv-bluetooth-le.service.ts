import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {CDV_BLE_RESTORE_KEY} from './cdv-bluetooth-le-config';
import {take} from 'rxjs/operators';
import _ from 'lodash';



/**
 *
 */

const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

// const SERVICE_TEST_UUID = '01000001-0101-0101-FFFF-000000000001';
   const SERVICE_TEST_UUID = '11A33463-26ff-0101-FFFF-000000000' + _.random(10, 99) + (isIos ? '1' : '0');


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

    static isBleInitialized = new Promise( async (resolve, reject) => {

        await CdvBluetoothLeService.assertCordovaDeviceReady();

        const initParams = {
            request: true,
            restoreKey: 'coronago'
        };

        window.bluetoothle.initialize(
            resolve, initParams
        );
    });



    private static advReceivedSubject$ = new Subject();

    public static advReceived$ = CdvBluetoothLeService.advReceivedSubject$.asObservable();




    static async assertCordovaDeviceReady(): Promise<any> {
        return CdvBluetoothLeService.isDeviceReady;
    }

    /**
     *
     */
    static async initialize(): Promise<any> {

        await CdvBluetoothLeService.assertPreConditions();

        return CdvBluetoothLeService.isBleInitialized;
    }

    static async initializePeripheral(): Promise<any> {

        await CdvBluetoothLeService.initialize();

        const peripheralEventReceivedSubject$ = new Subject();
        const peripheralEventReceived$ = peripheralEventReceivedSubject$.asObservable();

        const initPeriParams = {
            request: true,
            restoreKey: CDV_BLE_RESTORE_KEY
        };


        window.bluetoothle.initializePeripheral(
            (obj) => {
                console.error('initializePeripheral success', obj);
                peripheralEventReceivedSubject$.next(obj);
            },
            (errObj) => {
                console.error('initializePeripheral error', errObj);
                peripheralEventReceivedSubject$.error(errObj);
            },
            initPeriParams
        );



        return new Promise(( resolve, reject ) => {
            peripheralEventReceived$
                .pipe(take(1))
                .subscribe(obj => {
                    resolve(peripheralEventReceived$);
                });
        });

    }

    static async removeAllService(): Promise<any> {
        return new Promise( (resolve, reject) => {
            window.bluetoothle.removeAllServices(resolve, reject);
        });
    }

    static async addService(): Promise<any> {

        const serviceParams = {
            service: SERVICE_TEST_UUID,
            characteristics: [
                {
                    uuid: 'ABCD',
                    permissions: {
                        read: true,
                        // write: true,
                        // readEncryptionRequired: true,
                        // writeEncryptionRequired: true,
                    },
                    properties : {
                        read: true,
                        // writeWithoutResponse: true,
                        // write: true,
                        // notify: true,
                        // indicate: true,
                        // authenticatedSignedWrites: true,
                        // notifyEncryptionRequired: true,
                        // indicateEncryptionRequired: true,
                    }
                }
            ]
        };

        return new Promise( (resolve, reject) => {
            window.bluetoothle.addService(resolve, reject, serviceParams);
        });

    }

    static async stopAdvertising(): Promise<any> {
        return new Promise( (resolve, reject) => {
            window.bluetoothle.stopAdvertising(
                resolve, resolve);
        });
    }

    static async startAdvertising(): Promise<any> {

        if (isIos) {

            const msgGe = await CdvBluetoothLeService.removeAllService();
            console.error('remove service', msgGe);

            const msg = await CdvBluetoothLeService.addService();
            console.error('add service', msg);
        }

        const hasLocation = await CdvBluetoothLeService.hasLocationPermission();
        if (!hasLocation){
            const locPerm = await CdvBluetoothLeService.requestLocationPermission();
            console.error('requestLocation', locPerm);
        }

        console.error('Start Advertising...');

        const advParams = {
            // services: ["1234"],
            // service: "12341234-1234-1234-1234-1234aaaabbbb",
            // service: "123412341234123412341234aaaabbbb",
            // service: "01010101",
            services: [SERVICE_TEST_UUID], // ios
            service: SERVICE_TEST_UUID,    // android

            name: '',

            mode: 'lowLatency',
            powerLevel: 'high',
            connectable: true,
            timeout: 0, // disable timeout
            includeDeviceName: false,
            includeTxPowerLevel: false

            // manufacturerId: 01,
            // manufacturerSpecificData: "Rand",
        };

        return new Promise( (resolve, reject) => {
            window.bluetoothle.startAdvertising(
                resolve, reject, advParams);
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

    static async hasLocationPermission(): Promise <any> {

        return new Promise((resolve, reject) => {

            window.bluetoothle.isLocationEnabled(resolve, reject);

        });

    }

    static async requestLocationPermission(): Promise <any> {

        return new Promise((resolve, reject) => {

            window.bluetoothle.requestLocation(resolve, reject);

        });

    }

    static async requestBlePermission(): Promise<any> {

        return new Promise((resolve, reject) => {

            window.bluetoothle.requestPermission(resolve, reject);

        });

    }

    static async stopScan(): Promise<any> {

        return new Promise( ( resolve, reject) => {

            window.bluetoothle.stopScan(resolve, reject);

        });

    }

    static async startScan(): Promise<any> {

        await CdvBluetoothLeService.assertPreConditions();

        const scanParams = {
            allowDuplicates: true // iOS
        };

        return new Promise((resolve, reject) => {

            window.bluetoothle.startScan(
                (obj) => {

                    // console.error('raw-scan-obj', obj)

                    if (obj.status === 'scanStarted') {
                        console.error(obj);
                        resolve(obj);
                    }

                    if (obj.status === 'scanResult') {
                        CdvBluetoothLeService.advReceivedSubject$.next(obj);
                    }

                },
                (obj) => {
                    console.error('startScan error', obj);
                    CdvBluetoothLeService.advReceivedSubject$.error(obj);
                },
                scanParams);

        });

    }

}
