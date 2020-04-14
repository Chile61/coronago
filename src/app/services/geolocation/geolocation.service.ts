import { Injectable } from '@angular/core';
import {Observable, race, throwError, timer} from 'rxjs';
import { LogManager } from '../log.service';
import {mergeMap} from 'rxjs/operators';

export class GeolocationServiceError {
    constructor(public errorMessage) {}
}

export class GeolocationServiceTimeoutError extends GeolocationServiceError {
}

@Injectable({
    providedIn: 'root',
})
export class GeolocationService {
    private log = new LogManager('GeolocationService');
    constructor() {}

    /**
     * Get current geo location
     */
    public getGeoLocation(): Observable<Position> {
        return new Observable<Position>((subscriber) => {
            navigator.geolocation.getCurrentPosition(
                (data) => {
                    subscriber.next(data);
                    subscriber.complete();
                },
                (error) => {
                    this.log.error(this.getGeoLocation.name, 'Failed to get geo location');
                    subscriber.error(error);
                },
                { enableHighAccuracy: true }
            );
        });
    }

    public getGeoLocationWithTimeout(timeoutSec: number): Observable<Position> {

        const timeoutMsec = timeoutSec * 1000;
        const throwErrAfterTimeout$ = timer(timeoutMsec)
            .pipe(
                mergeMap(
                    () => throwError(new GeolocationServiceTimeoutError('Cordova geolocation request timed out!'))
                )
            );

        return race(
            this.getGeoLocation(),
            throwErrAfterTimeout$
        );

    }

}
