import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../../services/api-services/user.service';
import { FlagService } from '../../../../services/flag.service';
import { Subscription } from 'rxjs';
import { ObservableService } from '../../../../services/observable.service';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    public showAllAreaDevices: boolean;
    public maxRenderDevices: number;
    public simulateContacts: boolean;
    public hasConfirmedDisclaimer: boolean;
    public showNodeDebugInfo: boolean;
    public userId: string;
    public loginToken: string;

    constructor(private flagService: FlagService) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.flagService.showAllAreaDevices$.subscribe(value => {
                this.showAllAreaDevices = value;
            }),
            this.flagService.maxRenderDevices$.subscribe(value => {
                this.maxRenderDevices = value;
            }),
            this.flagService.simulateContacts$.subscribe(value => {
                this.simulateContacts = value;
            }),
            this.flagService.hasConfirmedDisclaimer$.subscribe(value => {
                this.hasConfirmedDisclaimer = value;
            }),
            this.flagService.showNodeDebugInfo$.subscribe(value => {
                this.showNodeDebugInfo = value;
            }),
            this.flagService.localUserId$.subscribe(value => {
                this.userId = value;
            }),
            this.flagService.loginToken$.subscribe(value => {
                this.loginToken = value;
            })
        );
    }

    ngOnDestroy(): void {
        ObservableService.unsubscribeFromAll(this.subscriptions);
    }

    /**
     * Set new value for setShowAllAreaDevices
     */
    public setShowAllAreaDevices(value: boolean): void {
        this.flagService.updateValue(this.flagService.showAllAreaDevicesKey, value);
    }

    /**
     * Set new value for max render devices
     */
    public setMaxRenderDevices(value: number): void {
        this.flagService.updateValue(this.flagService.maxRenderDevicesKey, value);
    }

    /**
     * Set new value for simulate contacts
     */
    public setSimulateContacts(value: number): void {
        this.flagService.updateValue(this.flagService.simulateContactsKey, value);
    }

    /**
     * Set new value for confirmed disclaimer
     */
    public setConfirmedDisclaimer(value: boolean): void {
        this.flagService.updateValue(this.flagService.hasConfirmedDisclaimerKey, value);
    }

    /**
     * Set new value for show node debug info
     */
    public setShowNodeDebugInfo(value: boolean): void {
        this.flagService.updateValue(this.flagService.showNodeDebugInfoKey, value);
    }
}
