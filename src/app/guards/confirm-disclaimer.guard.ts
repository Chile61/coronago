import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FlagService } from '../services/flag.service';
import { first, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ConfirmDisclaimerGuard implements CanActivate, CanActivateChild {
    constructor(private flagService: FlagService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return this.flagService.hasConfirmedDisclaimer$.pipe(
            map((value) => {
                if (!!value) {
                    return true;
                }
                this.router.navigate(['disclaimer']);
                return false;
            })
        );
    }

    /**
     * Condition for child route to be activated
     * Only used when declared "CanActivateChildren"
     */
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return this.canActivate(route, state);
    }
}
