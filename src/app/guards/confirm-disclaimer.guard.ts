import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FlagService } from '../services/flag.service';

@Injectable({
    providedIn: 'root',
})
export class ConfirmDisclaimerGuard implements CanActivate, CanActivateChild {
    constructor(private flagService: FlagService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        if (!!this.flagService.hasConfirmedDisclaimer$.getValue()) {
            return true;
        } else {
            this.router.navigate(['disclaimer']);
        }
    }

    /**
     * Condition for child route to be activated
     * Only used when declared "CanActivateChildren"
     */
    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        return this.canActivate(route, state);
    }
}
