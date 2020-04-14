import { Injectable } from '@angular/core';
import _ from 'lodash';
import {UserService} from '../api-services/user.service';
import {CgUserManagementEventBusService} from '../ble/cg-user-management-event-bus.service';

@Injectable({
    providedIn: 'root'
})
export class ContactIdRollerService {

    idValidityDurationMin = 15;

    currentId = null;

    constructor() { }

    init(): void{
        this.startRollingIdInterval();
    }

    private startRollingIdInterval(): void {

        const idValidityDurationMsec = this.idValidityDurationMin * 60 * 1000;

        setInterval(() => {
            this.rollNewId();
        }, idValidityDurationMsec);
    }

    private rollNewId(): void {
        const newUuid = this.createNewUuid();
        this.currentId = newUuid;

        CgUserManagementEventBusService.newUserIdRolled$.next(newUuid);

    }

    private createNewUuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
    }

    public getUserId(): string {
        return this.currentId;
    }
}
