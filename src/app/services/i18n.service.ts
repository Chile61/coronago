import { Injectable } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeGerman from '@angular/common/locales/de';
import localeEnglish from '@angular/common/locales/en';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root',
})
export class I18nService {
    public static activeLocaleKey: string;

    constructor(private translate: TranslateService) {}

    /**
     * Init service
     */
    public init(): void {
        this.registerLocales();
        I18nService.activeLocaleKey = 'en-US';

        // this language will be used as a fallback when a translation isn't found in the current language
        this.translate.setDefaultLang('en-US');

        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.translate.use(I18nService.activeLocaleKey);
    }

    /**
     * Import Angular language formats
     */
    private registerLocales(): void {
        registerLocaleData(localeGerman);
        registerLocaleData(localeEnglish);
    }
}
