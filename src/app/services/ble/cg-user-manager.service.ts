import { Injectable } from '@angular/core';
import {ReplaySubject, Subject} from 'rxjs';
import {CgPeripheral} from './cg-peripheral.class';
import _ from 'lodash';
import {CgUser} from './cg-user.class';
import {CgUserManagementEventBusService} from './cg-user-management-event-bus.service';


@Injectable({
  providedIn: 'root'
})
export class CgUserManagerService {

    private nearbyUserListUpdatedSubject$ = new Subject();
    public nearbyUserListUpdated$ = this.nearbyUserListUpdatedSubject$.asObservable();


    private cgUserByUserUuid = {};

    constructor() {

        this.startListenToUserManagementEvents();
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


            CgUserManagementEventBusService.userCreated$.next(cgUser);
        }

        cgUser.refreshLastSeenToRoughlyNow(
            cgPeripheral.lastSeenTimestamp,
            cgPeripheral.getRssi());
    }

    public terminateCgUser(cgUser: CgUser): void {
        const userId = cgUser.userUuId;
        console.error('ffr', '--------------------------------------------');
        console.error('ffr', 'UserManagement', 'DROPPING USER WITH userid', userId);
        console.error('ffr', '--------------------------------------------');
        delete this.cgUserByUserUuid[cgUser.userUuId];
    }

    // public dropUsersOlderThanSec(maxAgeSec): void {
    //
    //     console.error('ffr', 'CHECK IF TO DROP USERS');
    //
    //     const cgUsersToDrop = _.filter(this.cgUserByUserUuid, (cgUser: CgUser) => {
    //         return cgUser.isLastSeenOlderThanSec(maxAgeSec);
    //     });
    //
    //     _.each(cgUsersToDrop, (cgUser: CgUser) => {
    //         const userId = cgUser.userUuId;
    //         console.error('ffr', 'DROPPING USER WITH userid', userId);
    //         delete this.cgUserByUserUuid[cgUser.userUuId];
    //     });
    // }


    private startListenToUserManagementEvents(): void {

        CgUserManagementEventBusService.userTerminationRequested$
            .subscribe( (cgUser: CgUser) => {

                try {
                    this.terminateCgUser(cgUser);
                    this.notifySystemOfUpdatedNearbyUsers();
                } catch (e) {
                    console.error(e);
                    console.error('ffr', 'Issue terminating user', cgUser);
                }

            });


        CgUserManagementEventBusService.userRssiUpdated$
            .subscribe( (cgUser: CgUser) => {
                try {
                    this.notifySystemOfUpdatedNearbyUsers();
                } catch (e) {
                    console.error(e);
                    console.error('ffr', 'Issue terminating user', cgUser);
                }

            });

    }

    public notifySystemOfUpdatedNearbyUsers(): void {
        const cgUsers = this.getUsers();
        this.nearbyUserListUpdatedSubject$.next(cgUsers);
    }


}
