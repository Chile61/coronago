import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LogManager } from '../log.service';

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
                    // @ts-ignore
                    // subscriber.next(error);
                    // subscriber.complete();
                    subscriber.error(error);
                },
                { enableHighAccuracy: true }
            );
        });
    }
}
