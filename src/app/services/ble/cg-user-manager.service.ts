import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {CgPeripheral} from './cg-peripheral.class';
import _ from 'lodash';
import {CgUser} from './cg-user.class';
import {BleScanCycleManagerService} from './ble-scan-cycle-manager.service';




@Injectable({
  providedIn: 'root'
})
export class CgUserManagerService {


    private cgUserByUserUuid = {};

    constructor() {
    }

    public getUsers(): CgUser[] {
        return _.values(this.cgUserByUserUuid);
    }

    public createOrUpdateUser(cgPeripheral: CgPeripheral): void {

        const cgUserId = cgPeripheral.getUserId();

        let cgUser: CgUser = this.cgUserByUserUuid[cgUserId];

        if (!cgUser){
            cgUser = new CgUser(cgUserId);
            this.cgUserByUserUuid[cgUserId] = cgUser;
        }

        cgUser.setLastSeenTimestamp(cgPeripheral.lastSeenTimestamp);
        cgUser.setRssi(cgPeripheral.getRssi());
    }

    public dropUsersOlderThanSec(maxAgeSec): void {

        console.error('ffr', 'CHECK IF TO DROP USERS');

        const cgUsersToDrop = _.filter(this.cgUserByUserUuid, (cgUser: CgUser) => {
            return cgUser.isLastSeenOlderThanSec(maxAgeSec);
        });

        _.each(cgUsersToDrop, (cgUser: CgUser) => {
            const userId = cgUser.userUuId;
            console.error('ffr', 'DROPPING USER WITH userid', userId);
            delete this.cgUserByUserUuid[cgUser.userUuId];
        });
    }


}
