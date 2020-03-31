import { Injectable } from '@angular/core';
import { FlagService } from './flag.service';
import { I18nService } from './i18n.service';

@Injectable({
    providedIn: 'root',
})
export class BootService {
    constructor(private flagService: FlagService, private i18nService: I18nService) {}

    /**
     * App services entry point
     */
    public initApp(): void {
        this.flagService.init();
        this.i18nService.init();
    }
}
