import {ScanResponse} from './cg-peripheral-manager.service';
import _ from 'lodash';
import to from 'await-to-js';
import {CdvBluetoothLeService} from './cdv-bluetooth-le.service';
import {CgUserManagerService} from './cg-user-manager.service';
import {CORONA_GO_BLE_SERVICE_UUID} from './cdv-bluetooth-le-config';

export class CgPeripheral {

    lastSeenTimestamp: number;

    lastRssi: number;

    cgUserId: string = null;

    private isConnectionAttemptInProgress = false;

    constructor(public address: string, private cgUserManagerService: CgUserManagerService){
    }

    public updateViaScanResp(scanResps: ScanResponse[]): void {
        const allRssis = _.map(scanResps, 'rssi');
        this.lastRssi = _.max(allRssis);
        this.setLastSeenTimestampToNow();
    }

    public getUserId = () => this.cgUserId;

    public didExtractUserId = () => this.cgUserId !== null;

    public isOlderThenMs = (ageMs) => this.getAgeMsec() > ageMs;

    private getAgeMsec(): number {
        return Date.now() - this.lastSeenTimestamp;
    }

    public getLastSeenReadableSec(): string {
        return ((Date.now() - this.lastSeenTimestamp) / 1000 ).toFixed(0);
    }

    public async cleanUp(): Promise<any> {
        await this.disconnectAndCloseBleConn();
    }

    public async retrieveUserId(): Promise<any> {

        if (!this.address) {
            console.error('ffr', 'peri', 'error while extracting user-id', 'no peripheral address');
            return;
        }


        if (this.isConnectionAttemptInProgress) {
            console.error('ffr', 'peri', this.address, 'Canceling connection-attempt. Already trying');
            return;
        }

        console.error('ffr', 'peri', this.address, 'Retrieving user-id/service data');

        this.isConnectionAttemptInProgress = true;

        // last 3 character als log  identifier
        const address = this.address;
        const connFlowId = _.random(1, 100);
        // const blePartnerId = address.slice(-3);
        const blePartnerId = address;


        const startTimeMs = Date.now();
        const connectionTimeoutMs = 5000;
        console.error('ffr', connFlowId, blePartnerId, 'connect attempt... ');
        let [err, msg] = await to( CdvBluetoothLeService.connectWithTimeout({
            address,
            autoConnect: false // android: Automatically connect as soon as the
                               // remote device becomes available
        }, connectionTimeoutMs));
        console.error('ffr', connFlowId, blePartnerId, 'connect response', JSON.stringify(err), JSON.stringify(msg));
        console.error('ffr', connFlowId, blePartnerId, `connect response time ${( (Date.now() - startTimeMs) / 1000 ).toFixed(0)}`, );


        if (err) {
            console.error('ffr', connFlowId, blePartnerId, 'error while connecting', JSON.stringify(err));
        } else  {

            [err, msg] = await to( CdvBluetoothLeService.discover({address}) );

            if (err) {

                console.error('ffr', connFlowId, blePartnerId, 'error while discover response', JSON.stringify(err), JSON.stringify(msg));

            } else {

                console.error('ffr', connFlowId, blePartnerId, 'discover response', JSON.stringify(err), JSON.stringify(msg));
                const dscvResp = msg;
                this.cgUserId = this.extractUserIdFromDiscoverResp(dscvResp);

                this.cgUserManagerService.createOrUpdateUser(this);
            }

        }

        await this.disconnectAndCloseBleConn(connFlowId);

        this.isConnectionAttemptInProgress = false;
    }

    private async disconnectAndCloseBleConn(connFlowId = -1): Promise<any> {
        const address = this.address;

        let [err, msg] = await to(CdvBluetoothLeService.disconnect({address}));
        console.error('ffr', connFlowId, address, 'disconnect', JSON.stringify(err), JSON.stringify(msg));

        [err, msg] = await to(CdvBluetoothLeService.close({address}));
        console.error('ffr', connFlowId, address, 'connect close response', JSON.stringify(err), JSON.stringify(msg));
    }

    private setLastSeenTimestampToNow(): void {

        this.lastSeenTimestamp = Date.now();

    }

    /**
     *
      {
      "status":"discovered", * "address":"73:FC:AC:B6:87:57","name":null,
      "services":[
      {"uuid":"1801","characteristics":[{"uuid":"2A05","properties":{"indicate":true},"permissions":{},"descriptors":[]}]},
      {"uuid":"1800","characteristics":[{"uuid":"2A00","properties":{"read":true},"permissions":{},"descriptors":[]},
      {"uuid":"2A01","properties":{"read":true},"permissions":{},"descriptors":[]},
      {"uuid":"2AA6","properties":{"read":true},"permissions":{},"descriptors":[]}]}]
      }
     * @param dscvResp
     */
    private extractUserIdFromDiscoverResp(dscvResp: DiscoverResp): string {

        if (!dscvResp.services || dscvResp.services.length === 0) {
            return 'n/a';
        }

        // return JSON.stringify(
        //     _.map(dscvResp.services, ( {uuid: serviceUuid, characteristics } ) => {
        //         const characteristicUuid = _.map(characteristics, 'uuid');
        //
        //
        //         return serviceUuid + ': ' + _.join(characteristicUuid);
        //     })
        // );

        const fallBackUuid = JSON.stringify(_.map(dscvResp.services, ( {uuid: serviceUuid, characteristics } ) => {
            const characteristicUuid = _.map(characteristics, 'uuid');
            return serviceUuid + ': ' + _.join(characteristicUuid);
        }));

        const cgGattServiceData = _.find(dscvResp.services, s => {
            return s.uuid.toUpperCase() === CORONA_GO_BLE_SERVICE_UUID.toUpperCase();
        });

        if (cgGattServiceData) {

            try {

                // the corona go gatt-service should have only one
                // characteristic --> [0]
                return cgGattServiceData.characteristics[0].uuid;

            } catch (e) {
                console.error('ffr', e);
                console.error('ffr', 'Could not extract service id');
                return fallBackUuid;
            }

        } else {
            return fallBackUuid;
        }




    }

    public getRssi(): number {
        return this.lastRssi;
    }
}



interface DiscoverResp {
    services: {
        uuid: string;
        characteristics: {uuid: string}[]
    }[];
}

