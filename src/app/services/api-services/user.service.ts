import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface GetUserScoreResponse {
    score: number;
    userId: number;
    timestamp: Date;
}

interface CreateUserResponse {
    userId: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private backendService: BackendService) {}

    /**
     * Get user score
     */
    public createUser(): Observable<CreateUserResponse> {
        const route = environment.apiEndpoints.createUser;
        return this.backendService.GET(route);
    }

    /**
     * Get user score
     */
    public getUserScore(userId: number): Observable<GetUserScoreResponse> {
        const route = environment.apiEndpoints.userScore + '?userId=' + userId;
        return this.backendService.GET(route);
    }
}
