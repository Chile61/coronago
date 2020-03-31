import { Component, OnDestroy, OnInit } from '@angular/core';
import { APP_ICONS } from '../../ui-components/icons/icons';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ObservableService } from '../../services/observable.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit, OnDestroy {
    public newsUrl = 'https://corona.saarland.de/DE/home/home_node.html';
    private subscriptions: Subscription[] = [];
    public environment = environment;

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

    /**
     * Open news page in browser tab
     */
    public openNewsPage(): void {
        this.platform.ready().then(() => {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.browsertab) {
                window.cordova.plugins.browsertab.isAvailable(
                    (result) => {
                        if (result) {
                            window.cordova.plugins.browsertab.openUrl(this.newsUrl);
                        } else {
                            window.open(this.newsUrl, '_blank');
                        }
                    },
                    (error) => {
                        window.open(this.newsUrl, '_blank');
                    }
                );
            } else {
                window.open(this.newsUrl, '_blank');
            }
        });
    }
}
