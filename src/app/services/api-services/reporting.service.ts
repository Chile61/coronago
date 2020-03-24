import { Injectable } from '@angular/core';
import { ContactLocation } from '../../ui-components/score-log-entry/components/score-log-entry/log-entry';
import { Observable } from 'rxjs';
import { BackendService } from '../backend.service';
import { environment } from '../../../environments/environment';

interface ReportResponse {
    success: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ReportingService {
    constructor(private backendService: BackendService) {}

    /**
     * Report user clash
     */
    public reportMeeting(localUserId: string, detectedUserId: string, rssi: number, location: ContactLocation): Observable<ReportResponse> {
        const queryParams = [
            'me=' + localUserId,
            'other=' + detectedUserId,
            'timestamp=' + Date.now(),
            'rssi=' + rssi,
            'lng=' + location.lng,
            'lat=' + location.lat
        ];
        const query = '?' + queryParams.join('&');

        return this.backendService.GET(environment.apiEndpoints.reportMeeting + query);
    }
}
