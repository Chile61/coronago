import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class FlagService {
    public showAllAreaDevicesKey = 'showAllAreaDevices';
    public showAllAreaDevices$ = new BehaviorSubject<boolean>(null);

    public maxRenderDevicesKey = 'maxRenderDevices';
    public maxRenderDevices$ = new BehaviorSubject<number>(4);

    public simulateContactsKey = 'simulateContacts';
    public simulateContacts$ = new BehaviorSubject<boolean>(null);

    constructor(private storage: Storage) {}

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
        this.storage.get(this.showAllAreaDevicesKey).then(value => {
            if (value !== null) {
                this.showAllAreaDevices$.next(value);
            }
        });
        this.storage.get(this.maxRenderDevicesKey).then(value => {
            if (value !== null) {
                this.maxRenderDevices$.next(value);
            }
        });
        this.storage.get(this.simulateContactsKey).then(value => {
            if (value !== null) {
                this.simulateContacts$.next(value);
            }
        });
    }
}
