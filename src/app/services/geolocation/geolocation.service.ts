import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GeolocationService {
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
                    // @ts-ignore
                    subscriber.next(error);
                    subscriber.complete();
                },
                { enableHighAccuracy: true }
            );
        });
    }
}
