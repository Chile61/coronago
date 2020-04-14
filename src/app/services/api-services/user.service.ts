import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import {Observable, of} from 'rxjs';
import { environment } from '../../../environments/environment';
import { LogManager } from '../log.service';
import {ContactIdSinkService} from '../contact/contact-id-sink.service';
import {ContactIdRollerService} from '../contact/contact-id-roller.service';

export interface GetUserScoreResponse {
    networkSize: number;
}

export interface CreateUserResponse {
    userId: string;
    token: string;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private log = new LogManager('UserService');

    constructor(
        private contactIdSinkService: ContactIdSinkService,
        private contactIdRollerService: ContactIdRollerService
    ) {}

    /**
     * Get user score
     */
    public createUser(): Observable<CreateUserResponse> {
        const userUuid = this.contactIdRollerService.getUserId();

        return of({
            userId: userUuid,
            token: userUuid
        });
    }

    /**
     * Get user score
     */
    public getUserScore(userId: string): Observable<GetUserScoreResponse> {
        return this.contactIdSinkService.getUserScore();
    }
}
