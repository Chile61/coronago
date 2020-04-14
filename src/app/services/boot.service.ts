import { Injectable } from '@angular/core';
import { FlagService } from './flag.service';
import { I18nService } from './i18n.service';
import { LocalNotificationService } from './local-notification.service';
import { BackgroundModeService } from './background-mode.service';
import { BackgroundGeolocationService } from './background-geolocation.service';
import {ContactIdSinkService} from './contact/contact-id-sink.service';
import {ContactIdRollerService} from './contact/contact-id-roller.service';

@Injectable({
    providedIn: 'root',
})
export class BootService {
    constructor(
        private flagService: FlagService,
        private i18nService: I18nService,
        private localNotificationService: LocalNotificationService,
        private backgroundModeService: BackgroundModeService,
        private backgroundGeolocationService: BackgroundGeolocationService,
        private userIdSinkService: ContactIdSinkService,
        private contactRollerIdService: ContactIdRollerService,
    ) {}

    /**
     * App services entry point
     */
    public initApp(): void {
        this.contactRollerIdService.init();
        this.flagService.init();
        this.userIdSinkService.init();
        this.i18nService.init();
        this.localNotificationService.init();
        this.backgroundModeService.init();
        this.backgroundGeolocationService.init();
    }
}
