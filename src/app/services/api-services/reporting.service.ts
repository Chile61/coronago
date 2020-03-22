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
    public reportClash(localUserId: number, detectedUserId: number, rssi: number, location: ContactLocation): Observable<ReportResponse> {
        const body = {
            localUserId,
            detectedUserId,
            rssi,
            location: location
        };

        return this.backendService.POST(environment.apiEndpoints.reportClash, body);
    }
}
