import { Injectable } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeGerman from '@angular/common/locales/de';

@Injectable({
    providedIn: 'root'
})
export class BootService {
    constructor() {}

    /**
     * App services entry point
     */
    public initApp(): void {
        BootService.registerLocales();
    }

    /**
     * Import Angular language formats
     */
    private static registerLocales(): void {
        registerLocaleData(localeGerman);
    }
}
