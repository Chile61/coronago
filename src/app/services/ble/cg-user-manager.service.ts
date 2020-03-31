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

        cgUser.setRssi(cgPeripheral.getRssi());
    }


}
