import { Injectable } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeGerman from '@angular/common/locales/de';
import { UserService } from './api-services/user.service';
import { FlagService } from './flag.service';

@Injectable({
    providedIn: 'root'
})
export class BootService {
    constructor(private userService: UserService, private flagService: FlagService) {}

    /**
     * App services entry point
     */
    public initApp(): void {
        BootService.registerLocales();
        this.userService.init();
        this.flagService.init();
    }

    /**
     * Import Angular language formats
     */
    private static registerLocales(): void {
        registerLocaleData(localeGerman);
    }
}
