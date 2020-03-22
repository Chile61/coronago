import { Injectable } from '@angular/core';
// @ts-ignore
import urlJoin from 'proper-url-join';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class BackendService {
    private baseRoute = environment.apiBaseUrl;

    constructor(private http: HttpClient) {}

    /**
     * Catch some http error
     */
    // @ts-ignore
    private catchSomeError(error: HttpErrorResponse): Observable<HttpErrorResponse> {
        of(error);
    }

    /**
     * Http request GET
     */
    public GET(route: string): Observable<any> {
        return this.http
            .get(urlJoin(this.baseRoute, route), {
                headers: {
                    Authorization: null
                }
            })
            .pipe(catchError(error => this.catchSomeError(error)));
    }

    /**
     * Http request GET
     */
    public POST(route: string, data: any): Observable<any> {
        return this.http
            .post(urlJoin(this.baseRoute, route), data, {
                headers: {
                    Authorization: null
                }
            })
            .pipe(catchError(error => this.catchSomeError(error)));
    }

    /**
     * Http request GET
     */
    public PUT(route: string, data: any): Observable<any> {
        return this.http
            .put(urlJoin(this.baseRoute, route), data, {
                headers: {
                    Authorization: null
                }
            })
            .pipe(catchError(error => this.catchSomeError(error)));
    }

    /**
     * Http request GET
     */
    public DELETE(route: string): Observable<any> {
        return this.http
            .delete(urlJoin(this.baseRoute, route), {
                headers: {
                    Authorization: null
                }
            })
            .pipe(catchError(error => this.catchSomeError(error)));
    }
}
