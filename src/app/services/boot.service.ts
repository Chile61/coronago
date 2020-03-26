import { Injectable } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeGerman from '@angular/common/locales/de';
import { FlagService } from './flag.service';
import { BackgroundGeolocationService } from './geolocation/background-geolocation.service';

@Injectable({
    providedIn: 'root',
})
export class BootService {
    constructor(private flagService: FlagService, private geolocationService: BackgroundGeolocationService) {}

    /**
     * App services entry point
     */
    public initApp(): void {
        BootService.registerLocales();
        this.flagService.init();
        this.geolocationService.init();
    }

    /**
     * Import Angular language formats
     */
    private static registerLocales(): void {
        registerLocaleData(localeGerman);
    }
}
