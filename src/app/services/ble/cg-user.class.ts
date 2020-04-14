import _ from 'lodash';
import {CgUserManagerService} from './cg-user-manager.service';
import {CgUserManagementEventBusService} from './cg-user-management-event-bus.service';

export class CgUser {

    // Lifecycle: Degrade rssi after 90sec
    public static RssiDegradationTtlSec = 90;
    public static RssiDegradationTtlRssi = -100;

    // Lifecycle: Terminate after 210sec
    public static TerminateMeAfterTtlSec = 150; // 2.5 minutes



    public lastSeenTimestamp: number = null;

    public lastSeenRssi: number = null;

    constructor(public userUuId: string){
    }


    /**
     * After { CgUser.TerminateMeAfterTtlSec } please terminate me
     */
    private refreshWillToSurvive = _.debounce(() => {

        console.error('ffr', '----------------------------------------');
        console.error('ffr', 'User life-cycle',
            'User ' +  this.userUuId + ' was not seen for ' + CgUser.TerminateMeAfterTtlSec + 'sec. ' +
            'Terminating User.');
        console.error('ffr', '----------------------------------------');

        CgUserManagementEventBusService.requestUserTermination(this);
    }, CgUser.TerminateMeAfterTtlSec * 1000);


    /**
     * After 90 sec, distance me
     */
    private refreshWillToLive = _.debounce(() => {

        console.error('ffr', '----------------------------------------');
        console.error('ffr', 'User life-cycle',
            'User ' +  this.userUuId + ' was not seen for ' + CgUser.RssiDegradationTtlSec + 'sec. ' +
            'Artificially degrading RSSI');
        console.error('ffr', '----------------------------------------');

        this.lastSeenRssi = CgUser.RssiDegradationTtlRssi;

        CgUserManagementEventBusService.notifyRssiUpdated(this);
    }, CgUser.RssiDegradationTtlSec * 1000);


    /**
     * @param timestamp: should be more or less in the range of a couple of
     * seconds
     */
    public refreshLastSeenToRoughlyNow(timestamp, rssi): void {
        this.lastSeenTimestamp = timestamp;
        this.lastSeenRssi = rssi;
        this.refreshWillToLive();
        this.refreshWillToSurvive();
    }


    // public setRssi(rssi: number): void {
    //     this.lastSeenRssi = rssi;
    // }
    //
    // public isLastSeenOlderThanSec(maxAgeSec): boolean {
    //     const lastSeenAgeSec = ( Date.now() - this.lastSeenTimestamp ) / 1000;
    //     return lastSeenAgeSec > maxAgeSec;
    // }


    public getLastSeenReadableSec(): string {
        return ((Date.now() - this.lastSeenTimestamp) / 1000 ).toFixed(0);
    }



}




