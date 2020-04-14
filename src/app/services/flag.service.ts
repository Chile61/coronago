import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';
import { UserService } from './api-services/user.service';
import { LogManager } from './log.service';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import {CgUserManagementEventBusService} from './ble/cg-user-management-event-bus.service';

@Injectable({
    providedIn: 'root',
})
export class FlagService {
    private log = new LogManager('FlagService');
    private inProgressUserRequest = false;

    public showAllAreaDevicesKey = 'showAllAreaDevices';
    public showAllAreaDevices$ = new BehaviorSubject<boolean>(false);

    public maxRenderDevicesKey = 'maxRenderDevices';
    public maxRenderDevices$ = new BehaviorSubject<number>(4);

    public simulateContactsKey = 'simulateContacts';
    public simulateContacts$ = new BehaviorSubject<boolean>(false);

    public hasConfirmedDisclaimerKey = 'hasConfirmedDisclaimer';
    public hasConfirmedDisclaimer$ = new ReplaySubject<boolean>(1);

    public showNodeDebugInfoKey = 'showNodeDebugInfo';
    public showNodeDebugInfo$ = new BehaviorSubject<boolean>(false);

    public localUserIdKey = 'localUserId';
    public localUserId$ = new ReplaySubject<string>(1);

    public loginTokenKey = 'loginToken';
    public loginToken$ = new ReplaySubject<string>(1);

    public localUserLastScoreKey = 'localUserLastScore';
    public localUserLastScore$ = new ReplaySubject<number>(1);

    public appLanguageKey = 'appLanguage';
    public appLanguage$ = new ReplaySubject<string>(1);

    constructor(private storage: Storage, private userService: UserService, private translate: TranslateService) {

        CgUserManagementEventBusService.newUserIdRolled$.subscribe((userId) => {
            this.createNewUserId();
        });

        this.localUserId$.subscribe((userId) => {
            this.log.error('constructor', 'userId$ emitted', userId);
            // if (!userId || !userId.length) {
            //     // this.log.error('constructor', 'Creating new userId');
            //     // this.createNewUserId();
            // }
        });

        this.loginToken$.subscribe((token) => {
            this.log.error('constructor', 'token$', token);
            if (!token || !token.length) {
                this.log.error('constructor', 'Creating new userId');
                this.createNewUserId();
            }
        });
    }

    /**
     * Public service init
     */
    public init(): void {
        this.loadConfigFlags();
    }

    /**
     * Update config value
     */
    public updateValue(key: string, value): void {
        this.storage.set(key, value);
        this[key + '$'].next(value);
    }

    /**
     * Load config flags
     */
    private loadConfigFlags(): void {
        // Load debug config only for development, else use defaults
        if (!environment.production) {
            // Whether to show all devices in area or just 4
            this.storage.get(this.showAllAreaDevicesKey).then((value) => {
                if (value !== null) {
                    this.showAllAreaDevices$.next(value);
                }
            });

            // Max render devices
            this.storage.get(this.maxRenderDevicesKey).then((value) => {
                if (value !== null) {
                    this.maxRenderDevices$.next(value);
                }
            });

            // Simulate area contacts
            this.storage.get(this.simulateContactsKey).then((value) => {
                if (value !== null) {
                    this.simulateContacts$.next(value);
                }
            });

            // Show node debug info
            this.storage.get(this.showNodeDebugInfoKey).then((value) => {
                if (value !== null) {
                    this.showNodeDebugInfo$.next(value);
                }
            });
        }

        // Has confirmed disclaimer
        this.storage.get(this.hasConfirmedDisclaimerKey).then((value) => {
            this.hasConfirmedDisclaimer$.next(!!value);
        });

        // UserId
        this.storage.get(this.localUserIdKey).then((value) => {
            this.localUserId$.next(value);
        });

        // LoginToken
        this.storage.get(this.loginTokenKey).then((value) => {
            this.loginToken$.next(value);
        });

        // Last contact score
        this.storage.get(this.localUserLastScoreKey).then((value) => {
            if (value !== null) {
                this.localUserLastScore$.next(value);
            }
        });

        // Last contact score
        this.storage.get(this.appLanguageKey).then((value) => {
            if (value !== null) {
                this.appLanguage$.next(value);
            } else {
                this.setLanguageKey();
            }
        });
    }

    /**
     * Create new userId and save
     */
    private createNewUserId(): void {
        if (!this.inProgressUserRequest) {
            this.inProgressUserRequest = true;
            this.userService.createUser().subscribe((user) => {
                this.updateValue(this.localUserIdKey, user.userId);
                this.updateValue(this.loginTokenKey, user.token);
                this.inProgressUserRequest = false;

                this.localUserId$.next(user.userId);
            });
        }
    }

    /**
     * Set language key if not set
     */
    private setLanguageKey(): void {
        this.updateValue(this.appLanguageKey, this.translate.getBrowserCultureLang());
    }
}
