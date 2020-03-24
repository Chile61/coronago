import { Component, OnInit } from '@angular/core';
import { FlagService } from '../../../../services/flag.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-confirm-disclaimer',
    templateUrl: './confirm-disclaimer.component.html',
    styleUrls: ['./confirm-disclaimer.component.scss']
})
export class ConfirmDisclaimerComponent implements OnInit {
    constructor(private flagService: FlagService, private router: Router) {}

    ngOnInit() {}

    /**
     * Confirm disclaimer
     */
    public confirm(): void {
        this.flagService.updateValue(this.flagService.hasConfirmedDisclaimerKey, true);
        this.router.navigate(['']);
    }

    /**
     * Deny disclaimer
     */
    public deny(): void {
        this.flagService.updateValue(this.flagService.hasConfirmedDisclaimerKey, false);
        navigator['app'].exitApp();
    }
}
