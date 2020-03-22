import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface PingResponse {
    success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PingService {

    constructor(private backendService: BackendService) {}

    /**
     * Get user score
     */
    public getPing(): Observable<PingResponse> {
        const route = environment.apiEndpoints.ping;
        return this.backendService.GET(route);
    }
}
