import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { LogManager } from '../log.service';

interface GetUserScoreResponse {
    networkSize: number;
    // userId: number;
    // timestamp: Date;
}

interface CreateUserResponse {
    userId: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private log = new LogManager('UserService');
    public localUserId: string;
    public localUserIdLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private backendService: BackendService, private storage: Storage) {}

    public init(): void {
        this.createUserIfNotExist();
    }

    /**
     * Get user score
     */
    public createUser(): Observable<CreateUserResponse> {
        const route = environment.apiEndpoints.createUser;
        console.warn('route', route);
        return this.backendService.GET(route);
    }

    /**
     * Get user score
     */
    public getUserScore(userId: string): Observable<GetUserScoreResponse> {
        const route = environment.apiEndpoints.userScore + '?userId=' + userId;
        return this.backendService.GET(route);
    }

    /**
     * Create user if not registered yet
     */
    public createUserIfNotExist(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.storage.get('localUserId').then(userId => {
                if (userId) {
                    this.localUserId = userId;
                    this.localUserIdLoaded$.next(true);
                    resolve();
                } else {
                    console.warn('Create userId');
                    this.createUser().subscribe(
                        resp => {
                            this.localUserId = resp.userId;
                            this.storage.set('localUserId', resp.userId);
                            this.localUserIdLoaded$.next(true);
                            resolve();
                        },
                        error => {
                            this.log.error(this.createUserIfNotExist.name, 'Creating user failed!', error);
                            this.localUserIdLoaded$.next(false);
                            reject();
                        }
                    );
                }
            });
        });
    }
}
