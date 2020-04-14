import { Injectable } from '@angular/core';
import {Observable, of, ReplaySubject, Subject} from 'rxjs';
import {GetUserScoreResponse} from '../api-services/user.service';
import {CgUserManagerService} from '../ble/cg-user-manager.service';
import _ from 'lodash';
import {Storage} from '@ionic/storage';
import {CgUserManagementEventBusService} from '../ble/cg-user-management-event-bus.service';
import {CgUser} from '../ble/cg-user.class';

@Injectable({
    providedIn: 'root'
})
export class ContactIdSinkService {

    public cgUserUuidStorageKey = 'cgUserUuidStorageKey';
    public cgUserUuidSinkObj = {};


    public userCountUpdated$ = new ReplaySubject(1);

    constructor(
        private storage: Storage
    ) {

    }

    public async init(): Promise<any> {

        this.startListeningToNewCgUserId();

        // UserId
        const value  = await this.storage.get(this.cgUserUuidStorageKey);

        if (!value) {
            this.cgUserUuidSinkObj = {};
        } else {
            this.cgUserUuidSinkObj = value;
        }

        this.broadCastUserContactCount();

    }

    public getUserScore(): Observable<GetUserScoreResponse> {

        // const sinkSize = 34;

        return of( {
            networkSize: this.getCurContactCount()
        });
    }

    private startListeningToNewCgUserId(): void {

        CgUserManagementEventBusService.userCreated$
            .subscribe(( cgUser: CgUser ) => {
                this.registerNewUser(cgUser);
            });

    }

    private registerNewUser(cgUser: CgUser): void {


        const userUuid = cgUser.userUuId;

        if (!this.cgUserUuidSinkObj) {
            this.cgUserUuidSinkObj = {};
        }

        this.cgUserUuidSinkObj[userUuid] = Date.now();


        console.error('ffr', 'DECEN', JSON.stringify(this.cgUserUuidSinkObj));


        this.broadCastUserContactCount();

        this.saveCgUserUuid();
    }

    private broadCastUserContactCount(): void {
        const countUpdate = this.getCurContactCount();
        this.userCountUpdated$.next(countUpdate);
    }

    private getCurContactCount(): number {
        const countUpdate = _.keys(this.cgUserUuidSinkObj).length;
        return countUpdate;
    }

    private saveCgUserUuid(): void {
        this.updateValue(this.cgUserUuidStorageKey, this.cgUserUuidSinkObj);
    }

    public updateValue(key: string, value): void {
        this.storage.set(key, value);
    }

}
