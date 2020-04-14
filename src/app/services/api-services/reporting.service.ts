import { Injectable, OnDestroy } from '@angular/core';
import {Observable, of, Subscription} from 'rxjs';
import { BackendService } from '../backend.service';
import { environment } from '../../../environments/environment';
import { FlagService } from '../flag.service';
import { ObservableService } from '../observable.service';

interface ReportResponse {
    success: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class ReportingService implements OnDestroy {
    private subscriptions: Subscription[] = [];

    private localUserId: string;
    private loginToken: string;

    constructor(private backendService: BackendService, private flagService: FlagService) {
        this.subscriptions.push(
            this.flagService.localUserId$.subscribe((userId) => {
                this.localUserId = userId;
            }),
            this.flagService.loginToken$.subscribe((token) => {
                this.loginToken = token;
            })
        );
    }

    ngOnDestroy(): void {
        ObservableService.unsubscribeFromAll(this.subscriptions);
    }

    /**
     * Report user clash
     */
    public reportMeeting(detectedUserId: string, rssi: number): Observable<ReportResponse> {

        return of({
            success: true
        });
    }

    private isAppInBackground(): boolean {

        return window.cordova.plugins.backgroundMode.isActive();
    }
}
