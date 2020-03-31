import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FlagService } from '../../../../services/flag.service';
import { Subscription } from 'rxjs';
import { ObservableService } from '../../../../services/observable.service';
import { APP_ICONS } from '../../../../ui-components/icons/icons';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    public environment = environment;
    public icons = APP_ICONS;

    public userId: string;

    constructor(private flagService: FlagService, private cdRef: ChangeDetectorRef) {}

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
}
