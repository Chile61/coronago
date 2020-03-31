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

        const cgUserIdFromPeripheral = cgPeripheral.getUserId();
        if (!cgUserIdFromPeripheral) {
            console.error('ffr', 'Will not create a user from falsey: ', cgUserIdFromPeripheral);
            return;
        }

        let cgUser: CgUser = this.cgUserByUserUuid[cgUserIdFromPeripheral];

        if (!cgUser){
            cgUser = new CgUser(cgUserIdFromPeripheral);
            this.cgUserByUserUuid[cgUserIdFromPeripheral] = cgUser;
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
