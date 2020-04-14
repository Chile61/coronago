import { Injectable } from '@angular/core';
import {CgUser} from './cg-user.class';
import {ReplaySubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CgUserManagementEventBusService {

    private static userTerminationRequestedSubject$ = new Subject();
    public static userTerminationRequested$ = CgUserManagementEventBusService.userTerminationRequestedSubject$.asObservable();

    private static userRssiUpdatedSubject$ = new Subject();
    public static userRssiUpdated$ = CgUserManagementEventBusService.userRssiUpdatedSubject$.asObservable();

    public static userCreated$ = new ReplaySubject(1);

    public static newUserIdRolled$ = new ReplaySubject(1);

    public static requestUserTermination(cgUser: CgUser): void {
        CgUserManagementEventBusService.userTerminationRequestedSubject$.next(cgUser);
    }

    public static notifyRssiUpdated(cgUser: CgUser): void {
        CgUserManagementEventBusService.userRssiUpdatedSubject$.next(cgUser);
    }

}
