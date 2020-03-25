import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { LogManager } from '../log.service';

interface GetUserScoreResponse {
    networkSize: number;
}

interface CreateUserResponse {
    userId: string;
    token: string;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private log = new LogManager('UserService');

    constructor(private backendService: BackendService, private storage: Storage) {}

    public init(): void {}

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
    public getUserScore(userId: string): Observable<GetUserScoreResponse> {
        const route = environment.apiEndpoints.userScore + '?userId=' + userId;
        return this.backendService.GET(route);
    }
}
