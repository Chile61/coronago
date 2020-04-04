import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Platform } from '@ionic/angular';

class LocalNotificationTrigger {
    at: Date;
    in: number;
    unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

    count: number;
    every: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

    firstAt: Date;
    before: Date;
    after: Date;
}

export class LocalNotificationConfig {
    title: string;
    text: string;
    foreground: boolean;
    trigger: LocalNotificationTrigger;
}

@Injectable({
    providedIn: 'root',
})
export class LocalNotificationService {
    constructor(private platform: Platform) {}

    public init(): void {
        const trigger = new LocalNotificationTrigger();
        trigger.every = 'minute';
        trigger.count = 999999;

        const config = new LocalNotificationConfig();
        config.trigger = trigger;
        config.foreground = true;
        config.title = 'TEST 1';
        config.text = 'Hi I am here';
    }

    /**
     * Schedule local notification
     */
    public scheduleNotification(config: LocalNotificationConfig): void {
        this.platform.ready().then(() => {
            window.cordova.plugins.notification.local.schedule({
                title: config.title,
                text: config.text,
                foreground: config.foreground,
                trigger: config.trigger,
            });
        });
    }

    /**
     * Check has permissions
     */
    private hasNotifyPermissions(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            window.cordova.plugins.notification.local.hasPermission((granted) => {
                granted ? resolve(true) : resolve(false);
            });
        });
    }

    /**
     * Request notify permissions
     */
    private requestNotifyPermissions(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            window.cordova.plugins.notification.local.requestPermission((granted) => {
                granted ? resolve(true) : resolve(false);
            });
        });
    }
}
