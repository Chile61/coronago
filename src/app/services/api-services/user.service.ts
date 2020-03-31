import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { LogManager } from '../log.service';
import { GeolocationService } from '../geolocation/geolocation.service';
import { switchMap } from 'rxjs/operators';

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

    constructor(private backendService: BackendService, private storage: Storage, private geolocationService: GeolocationService) {}

    /**
     * Get user score
     */
    public createUser(): Observable<CreateUserResponse> {
        return this.geolocationService.getGeoLocation().pipe(

            // window.cordova.getGeo

            switchMap((location) => {
                const queryArgs = [];
                queryArgs.push('lng=' + location.coords.longitude);
                queryArgs.push('lat=' + location.coords.latitude);
                const route = `${environment.apiEndpoints.createUser}?${queryArgs.join('&')}`;

                return this.backendService.GET(route);
            })

        );
    }

    /**
     * Get user score
     */
    public getUserScore(userId: string): Observable<GetUserScoreResponse> {
        const route = environment.apiEndpoints.userScore + '?userId=' + userId;
        return this.backendService.GET(route);
    }
}
