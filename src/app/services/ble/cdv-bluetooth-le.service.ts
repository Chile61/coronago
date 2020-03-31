import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {
    CDV_BLE_RESTORE_KEY,
    CORONA_GO_BLE_SERVICE_UUID
} from './cdv-bluetooth-le-config';
import {take} from 'rxjs/operators';
import _ from 'lodash';
import to from 'await-to-js';



/**
 *
 */

const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

// const SERVICE_TEST_UUID = '01000001-0101-0101-FFFF-000000000001';
const TEST_USER_ID = '11A33463-26ff-0101-FFFF-000000000' + _.random(10, 99) + (isIos ? '1' : '0');


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


    private static advReceivedSubject$ = new Subject();
    public static advReceived$ = CdvBluetoothLeService.advReceivedSubject$.asObservable();


    private static peripheralEventReceivedSubject$ = new Subject();
    public static peripheralEventReceived$ = CdvBluetoothLeService.peripheralEventReceivedSubject$.asObservable();


    static isDeviceReady = new Promise((resolve, reject) => {
        document.addEventListener('deviceready', resolve);
    });

    static isBleInitialized = new Promise( async (resolve, reject) => {

        await CdvBluetoothLeService.assertCordovaDeviceReady();

        const initParams = {
            request: true,
            // restoreKey: 'coronago'
            restoreKey: CDV_BLE_RESTORE_KEY
        };

        window.bluetoothle.initialize(
            (resp) => {
                console.error('ffr', 'BLE initialize');
                resolve();
            }
            , initParams
        );
    });


    static isBlePeripheralInitialized = new Promise( async (resolve, reject) => {

        await CdvBluetoothLeService.isBleInitialized;

        const initPeriParams = {
            request: true,
            restoreKey: CDV_BLE_RESTORE_KEY
        };

        window.bluetoothle.initializePeripheral(
            (obj) => {
                console.error('ffr', 'initializePeripheral event cordova callback', obj);
                CdvBluetoothLeService.peripheralEventReceivedSubject$.next(obj);
            },
            (errObj) => {
                console.error('ffr', 'initializePeripheral error', errObj);
                CdvBluetoothLeService.peripheralEventReceivedSubject$.error(errObj);
            },
            initPeriParams
        );

        CdvBluetoothLeService.peripheralEventReceived$
            .pipe(take(1))
            .subscribe(obj => {
                resolve(obj);
            });

    });





    static async assertCordovaDeviceReady(): Promise<any> {
        return CdvBluetoothLeService.isDeviceReady;
    }

    static async hardInitialize(): Promise<any> {

        const initParams = {
            request: true,
            restoreKey: CDV_BLE_RESTORE_KEY
        };

        return new Promise( (resolve, reject) => {
            window.bluetoothle.initialize( (resp) => {
                    if (resp && resp.status === 'enabled') {
                        console.error('ffr', 'BLE initialize');
                        resolve();
                    } else {
                        reject(resp);
                    }
                }, initParams);
        });
    }

    /**
     *
     */
    static async initialize(): Promise<any> {

        await CdvBluetoothLeService.assertPreConditions();

        return CdvBluetoothLeService.isBleInitialized;
    }

    static async initializePeripheral(): Promise<any> {

        await CdvBluetoothLeService.isBlePeripheralInitialized;

        return Promise.resolve(CdvBluetoothLeService.peripheralEventReceived$);
        // await CdvBluetoothLeService.initialize();





        // return new Promise(( resolve, reject ) => {
        //     CdvBluetoothLeService.peripheralEventReceived$
        //         .pipe(take(1))
        //         .subscribe(obj => {
        //             resolve(CdvBluetoothLeService.peripheralEventReceived$);
        //         });
        // });

    }

    static async removeAllService(): Promise<any> {
        return new Promise( (resolve, reject) => {
            window.bluetoothle.removeAllServices(resolve, reject);
        });
    }

    static async addService(): Promise<any> {

        const serviceParams = {
            service: CORONA_GO_BLE_SERVICE_UUID,
            characteristics: [
                {
                    uuid: TEST_USER_ID,
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

        // const hasLocation = await CdvBluetoothLeService.hasLocationPermission();
        // if (!hasLocation){
        //     const locPerm = await CdvBluetoothLeService.requestLocationPermission();
        //     console.error('ffr', 'requestLocation', locPerm);
        // }

        console.error('ffr', 'Attempting Start Advertising...');

        const advParams = {
            // services: ["1234"],
            // service: "12341234-1234-1234-1234-1234aaaabbbb",
            // service: "123412341234123412341234aaaabbbb",
            // service: "01010101",
            services: [CORONA_GO_BLE_SERVICE_UUID], // ios
            service: CORONA_GO_BLE_SERVICE_UUID,    // android

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
        await CdvBluetoothLeService.requestBlePermissionIfNecessary();
    }

    private static async requestBlePermissionIfNecessary(): Promise<any> {

        if (!isIos) {

            const isBlePermitted = await CdvBluetoothLeService.hasBlePermission();

            if (!isBlePermitted) {
                const reqPermResponse = await CdvBluetoothLeService.requestBlePermission();
                console.error('ffr', 'REQ_PERMI_RESP', reqPermResponse);
            }

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

    static async hasBlePermission(): Promise<any> {

        return new Promise((resolve) => {

            window.bluetoothle.hasPermission( resp => {

                resolve(resp.hasPermission);

            });

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


    static async enableBleAdapter(): Promise<any> {
        return new Promise( ( resolve, reject) => {
            window.bluetoothle.enable(resolve, reject);
        });
    }

    static async disableBleAdapter(): Promise<any> {
        return new Promise( ( resolve, reject) => {
            window.bluetoothle.disable(resolve, reject);
        });
    }

    static async startScan(): Promise<any> {

        await CdvBluetoothLeService.assertPreConditions();

        const scanParams = {
            allowDuplicates: true, // iOS, no effect in background
            services: [CORONA_GO_BLE_SERVICE_UUID]
        };

        return new Promise((resolve, reject) => {

            window.bluetoothle.startScan(
                (obj) => {

                    // console.error('ffr', 'raw-scan-obj', JSON.stringify(obj) )

                    if (obj.status === 'scanStarted') {
                        // console.error(obj);
                        resolve(obj);
                    }

                    if (obj.status === 'scanResult') {
                        CdvBluetoothLeService.advReceivedSubject$.next(obj);
                    }

                },
                (obj) => {
                    console.error('ffr', 'startScan error', obj);
                    CdvBluetoothLeService.advReceivedSubject$.error(obj);
                },
                scanParams);

        });

    }

    static async isAdvertising(): Promise<any> {

        return new Promise((resolve, reject) => {

            window.bluetoothle.isAdvertising(resolve, reject);

        });

    }

    static async connectWithTimeout(params, timeoutMs): Promise<any> {

        const connTimeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => reject('connection timeout after' + timeoutMs + 'msec'), timeoutMs);
        });

        const connEstablishedPromise = new Promise((resolve, reject) => {
            window.bluetoothle.connect(resolve, reject, params);
        });

        return Promise.race([connTimeoutPromise, connEstablishedPromise]);
    }


    static async connect(params): Promise<any> {

        return new Promise((resolve, reject) => {

            window.bluetoothle.connect(resolve, reject, params);

        });

    }

    static async disconnect(params): Promise<any> {

        return new Promise((resolve, reject) => {

            // bluetoothle.disconnect(disconnectSuccess, disconnectError, params);
            window.bluetoothle.disconnect(resolve, reject, params);

        });

    }


    static async close(params): Promise<any> {

        return new Promise((resolve, reject) => {

            // bluetoothle.close(closeSuccess, closeError, params);
            window.bluetoothle.close(resolve, reject, {
                clearCache: true,
                ...params
            });

        });

    }

    static async discover(params): Promise<any> {

        return new Promise((resolve, reject) => {

            // bluetoothle.close(closeSuccess, closeError, params);
            window.bluetoothle.discover(resolve, reject, params);

        });

    }


}
