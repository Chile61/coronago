import _ from 'lodash';

const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

export class CdvBluetoothLeHelperService {

    constructor() { }

    public static base64ToHex(str: string): {} {

        const raw = atob(str);
        const resultHexList = [];
        const resultIntList = [];
        for (let i = 0; i < raw.length; i++) {
            let hex = raw.charCodeAt(i).toString(16);
            hex = (hex.length === 2 ? hex : '0' + hex);
            hex = (hex.length === 2 ? hex : '0' + hex).toUpperCase();
            resultHexList.push(hex);
        }

        return {resultHexList, resultIntList};
    }

    public static extractServiceUuidByteArrayFromAdvResp(resp): any{


        try {

            if (isIos) {
                const serviceUuidHexStr = resp.serviceUuids && resp.serviceUuids.length && resp.serviceUuids[0];

                if (!serviceUuidHexStr) {
                    throw 'no valid service-uuid found';
                }

                return CdvBluetoothLeHelperService.parseHexStrToByteArray(serviceUuidHexStr);

            } else {
                const rawBase64Str = resp;
                const advIntArray = window.bluetoothle.encodedStringToBytes(rawBase64Str);
                const serviceUuidByteArray = CdvBluetoothLeHelperService.extractServiceUuidOnAndroidAdv(advIntArray);
                return serviceUuidByteArray;
            }

        } catch (e) {
            console.error('error while parsing service-uuid from adv-packet', e);
            return null;
        }

    }

    /**
     * Finds the first service-uuid in the advertisement packet and reverses it
     * @param byteList
     */
    public static extractServiceUuidOnAndroidAdv(byteList: number[]): number[] {

        // advertising data
        const AD_TYPE_SERVICE_UUID = 7;
        let adIdx = 0;
        let adLength, adType;

        do {

            adLength = byteList[adIdx]; // includes the type field
            adType = byteList[adIdx + 1];

            if (adType === AD_TYPE_SERVICE_UUID) {
                const adDataStartIdx = adIdx + 2;
                const adDataLength = adLength - 1; // subtract the type field
                let serviceUuid = byteList.slice(adDataStartIdx, adDataStartIdx + adDataLength);
                serviceUuid = serviceUuid.reverse();
                return serviceUuid;
            }

            adIdx = adIdx + adLength + 1;

        } while (adLength !== 0);

        return null;
    }


    /**
     * 01000001-0101-0101-FFFF-000000000001
     * -->
     * [ 1, 0, 0, 1, 1, 1, 1, 1, 255, 255, 0, 0, 0, 0, 0, 1 ]
     */
    private static parseHexStrToByteArray(serviceUuidHexStr: string): number[] {

        serviceUuidHexStr = serviceUuidHexStr.replace(/[\-\s]/ig, '');

        const hexArray = _.chunk(serviceUuidHexStr, 2);

        const byteArray = _.map(hexArray, byteChunk => {

            const byteAsHexStr = '0x' + _.join(byteChunk, '');

            return parseInt(byteAsHexStr);

        });

        return byteArray;
    }

}
