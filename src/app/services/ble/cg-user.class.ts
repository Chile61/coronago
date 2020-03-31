
export class CgUser {

    lastSeenTimestamp: number = null;
    lastSeenRssi: number = null;

    constructor(public userUuId: string){
    }

    public setLastSeenTimestamp(timestamp): void {
        this.lastSeenTimestamp = timestamp;
    }

    public setRssi(rssi: number): void {
        this.lastSeenRssi = rssi;
    }

    public isLastSeenOlderThanSec(maxAgeSec): boolean {
        const lastSeenAgeSec = ( Date.now() - this.lastSeenTimestamp ) / 1000;
        return lastSeenAgeSec > maxAgeSec;
    }

}




