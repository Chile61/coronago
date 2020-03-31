import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';
import { UserService } from './api-services/user.service';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class FlagService {
    private subscriptions: Subscription[] = [];
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

    constructor(private storage: Storage, private userService: UserService) {
        this.subscriptions.push(
            this.localUserId$.subscribe((userId) => {
                if (userId === null) {
                    this.createNewUserId();
                }
            }),
            this.loginToken$.subscribe((token) => {
                if (token === null) {
                    this.createNewUserId();
                }
            })
        );
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

        // Has confirmed disclaimer
        this.storage.get(this.hasConfirmedDisclaimerKey).then((value) => {
            this.hasConfirmedDisclaimer$.next(!!value);
        });

        // Show node debug info
        this.storage.get(this.showNodeDebugInfoKey).then((value) => {
            if (value !== null) {
                this.showNodeDebugInfo$.next(value);
            }
        });

        // UserId
        this.storage.get(this.localUserIdKey).then((value) => {
            this.localUserId$.next(value);
        });

        // LoginToken
        this.storage.get(this.loginTokenKey).then((value) => {
            this.loginToken$.next(value);
        });
    }

    /**
     * Create new userId and save
     */
    private createNewUserId() {
        if (!this.inProgressUserRequest) {
            this.inProgressUserRequest = true;
            this.userService.createUser().subscribe((user) => {
                this.updateValue(this.localUserIdKey, user.userId);
                this.updateValue(this.loginTokenKey, user.token);
                this.inProgressUserRequest = false;
            });
        }
    }
}
