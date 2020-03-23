import { Injectable } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeGerman from '@angular/common/locales/de';
import { UserService } from './api-services/user.service';

@Injectable({
    providedIn: 'root'
})
export class BootService {
    constructor(private userService: UserService) {}

    /**
     * App services entry point
     */
    public initApp(): void {
        BootService.registerLocales();
        this.userService.createUserIfNotExist();
    }

    /**
     * Import Angular language formats
     */
    private static registerLocales(): void {
        registerLocaleData(localeGerman);
    }
}
