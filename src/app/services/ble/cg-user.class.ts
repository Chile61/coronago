
export class CgUser {

    lastSeenTimestamp: number = null;
    lastSeenRssi: number = null;

    constructor(public userUuId: string){
    }

    public setRssi(rssi: number): void {

        this.lastSeenTimestamp = Date.now();

        this.lastSeenRssi = rssi;

    }

}




