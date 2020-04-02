import { Injectable, OnDestroy } from '@angular/core';
import { ContactLocation } from '../../ui-components/score-log-entry/components/score-log-entry/log-entry';
import { Observable, Subscription } from 'rxjs';
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
    public reportMeeting(detectedUserId: string, rssi: number, location: Position): Observable<ReportResponse> {

        const isBg = this.isAppInBackground();

        const queryParams = [
            'me=' + this.localUserId,
            'other=' + detectedUserId,
            'me_time=' + Date.now(),
            'rssi=' + rssi,
            'lng=' + location.coords.longitude,
            'lat=' + location.coords.latitude,
            'token=' + this.loginToken,
            // 'isBg=' + (isBg ? 1 : 0),
            'isBg=' + 'null',
        ];
        const query = '?' + queryParams.join('&');

        return this.backendService.GET(environment.apiEndpoints.reportMeeting + query);
    }

    private isAppInBackground(): boolean {

        // return window.cordova.plugins.backgroundMode.isActive();
        return true;
    }
}
