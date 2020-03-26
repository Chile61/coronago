import { Component, OnDestroy, OnInit } from '@angular/core';
import { APP_ICONS } from '../../ui-components/icons/icons';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ObservableService } from '../../services/observable.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];

    public icons = APP_ICONS;

    constructor(private platform: Platform) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.platform.backButton.subscribe(() => {
                // navigator['app'].exitApp();
            })
        );
    }

    ngOnDestroy(): void {
        ObservableService.unsubscribeFromAll(this.subscriptions);
    }
}
