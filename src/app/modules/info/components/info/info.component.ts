import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FlagService } from '../../../../services/flag.service';
import { Subscription } from 'rxjs';
import { ObservableService } from '../../../../services/observable.service';
import { APP_ICONS } from '../../../../ui-components/icons/icons';
import { environment } from '../../../../../environments/environment';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    public environment = environment;
    public icons = APP_ICONS;

    public privacyPolicyUrl = 'https://coronago369135004.wordpress.com/datenschutz/';
    public userId: string;

    constructor(private flagService: FlagService, private cdRef: ChangeDetectorRef, private platform: Platform) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.flagService.localUserId$.subscribe((value) => {
                this.userId = value;
                this.cdRef.detectChanges();
            })
        );
    }

    ngOnDestroy(): void {
        ObservableService.unsubscribeFromAll(this.subscriptions);
    }

    /**
     * Open news page in browser tab
     */
    public openPrivacyPage(): void {
        this.platform.ready().then(() => {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.browsertab) {
                window.cordova.plugins.browsertab.isAvailable(
                    (result) => {
                        if (result) {
                            window.cordova.plugins.browsertab.openUrl(this.privacyPolicyUrl);
                        } else {
                            window.open(this.privacyPolicyUrl, '_blank');
                        }
                    },
                    (error) => {
                        window.open(this.privacyPolicyUrl, '_blank');
                    }
                );
            } else {
                window.open(this.privacyPolicyUrl, '_blank');
            }
        });
    }
}
