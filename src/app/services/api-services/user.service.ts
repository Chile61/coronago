import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface GetUserScoreResponse {
    score: number;
    userId: number;
    timestamp: Date;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private backendService: BackendService) {}

    /**
     * Get user score
     */
    public getUserScore(localUserId: number): Observable<GetUserScoreResponse> {
        const route = environment.apiEndpoints.userScore + '?userId=' + localUserId;

        return this.backendService.GET(route);
    }
}
