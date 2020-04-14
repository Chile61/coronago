import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { LogManager } from './log.service';
import to from 'await-to-js';
import { CordovaPlugin } from './cordova-plugin';
import { HelperService } from './helper.service';
import { Storage } from '@ionic/storage';

export class LocalNotificationTrigger {
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
    id: number;
    title: string;
    text: string;
    foreground: boolean;
    vibrate: boolean;
    silent: boolean;
    group: boolean;
    sticky: boolean;
    priority: number;
    color: string;
    trigger: LocalNotificationTrigger;
    timeoutAfter: LocalNotificationTrigger;
    icon: string;
    smallIcon: string;
}

type LocalNotificationEvent = 'add' | 'trigger' | 'click' | 'clear' | 'cancel' | 'update' | 'clearall' | 'cancelall';

interface LocalNotificationInterface {
    schedule: (config: LocalNotificationConfig | LocalNotificationConfig[]) => void;
    getDefaults: () => any;
    setDefaults: (values: { [prop: string]: any }) => void;
    addActions: (actionTypes: string, config: { [prop: string]: any }[]) => void;
    update: (values: { [prop: string]: any }) => void;
    hasPermission: (callback: (granted: boolean) => void) => void;
    requestPermission: (callback: (granted: boolean) => void) => void;
    getAll: (callback: (notifications: LocalNotificationConfig[]) => void) => void;

    // Listen for event
    on: (event: LocalNotificationEvent, callback: () => void) => void;

    // Remove event listener
    un: (event: LocalNotificationEvent, callback: () => void) => void;

    fireEvent: (event: LocalNotificationEvent, args: any) => void;

    // Check the launchDetails to find out if the app was launched by clicking on a notification.
    launchDetails: any;

    cancelAll: (callback?: (status: string) => void) => void;
}

@Injectable({
    providedIn: 'root',
})
export class LocalNotificationService extends CordovaPlugin {
    protected cordovaPlugin: LocalNotificationInterface;
    private log = new LogManager('LocalNotificationService');

    constructor(private platform: Platform, private storage: Storage) {
        super();
        this.setCordovaPlugin('notification.local');
    }

    public async init(): Promise<void> {
        await this.platform.ready();

        if (!this.isPluginAvailable()) {
            return;
        }

        await this.do();
    }

    public async do(): Promise<void> {
        interval(10000).subscribe(async () => {
            this.cordovaPlugin.getAll((notifications) => {
                this.log.log('getAll', notifications);
            });
        });

        /**
         * Runs only if app is in foreground/background
         * Despite the notification comes, when app is swiped
         */
        this.cordovaPlugin.on('trigger', async () => {
            // Do sth
            console.error('CORONA NOTIFICATION TRIGGER');
        });

        const [permError, hasPerm] = await to(this.handleNotificationPermission());
        if (permError) {
            return;
        }

        // Remove all previous notifications
        // TODO: Potentially a problem
        this.cordovaPlugin.cancelAll();

        // this.debugPingEveryMinute();
    }

    /**
     * DEBUG Ping every minute
     */
    private debugPingEveryMinute(): void {
        const trigger2 = new LocalNotificationTrigger();
        trigger2.every = 'minute';
        trigger2.count = 999;

        const config2 = new LocalNotificationConfig();
        config2.id = 1337;
        config2.trigger = trigger2;
        config2.foreground = true;
        config2.title = 'Notification every minute';
        config2.text = 'Hi I am here';
        this.scheduleNotification(config2);
    }

    /**
     * Notify immediately
     */
    public async immediatelyNotify(title: string, text: string, id?: number): Promise<void> {
        await this.handleNotificationPermission();

        const trigger = new LocalNotificationTrigger();
        trigger.in = 1;
        trigger.unit = 'second';

        const config = new LocalNotificationConfig();
        config.id = id ? id : Date.now();
        config.trigger = trigger;
        config.foreground = true;
        config.title = title;
        config.text = text;
        config.vibrate = true;

        this.scheduleNotification(config);
    }

    /**
     * Notify about new location
     */
    public notifyNewLocation(): void {
        this.immediatelyNotify('Du bis in einem neuen Ort!', 'Öffne die App zum scannen!', 127001);
    }

    /**
     * Check notification permissions and request if not available
     */
    private handleNotificationPermission(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            let hasPerm = await this.hasNotifyPermissions();
            if (!hasPerm) {
                hasPerm = await this.requestNotifyPermissions();
                if (!hasPerm) {
                    alert('Need notification permission! Grant and restart App');
                    reject();
                }
            } else {
                resolve();
            }
        });
    }

    /**
     * Schedule local notification
     */
    public async scheduleNotification(config: LocalNotificationConfig | LocalNotificationConfig[]): Promise<void> {
        config = this.addDefaultIconIfMissing(config);

        await this.platform.ready();
        const result = this.cordovaPlugin.schedule(config);
    }

    /**
     * Check has permissions
     */
    private async hasNotifyPermissions(): Promise<boolean> {
        await this.platform.ready();
        return new Promise((resolve, reject) => {
            this.cordovaPlugin.hasPermission((granted) => {
                granted ? resolve(true) : resolve(false);
            });
        });
    }

    /**
     * Request notify permissions
     */
    private async requestNotifyPermissions(): Promise<boolean> {
        await this.platform.ready();
        return new Promise<boolean>((resolve, reject) => {
            this.cordovaPlugin.requestPermission((granted) => {
                granted ? resolve(true) : resolve(false);
            });
        });
    }

    /**
     * Clear all notifications
     */
    private async clearAllNotifications(): Promise<void> {
        await this.platform.ready();
        return new Promise<void>((resolve, reject) => {
            this.cordovaPlugin.cancelAll((data) => {
                console.warn('CANCEL all data', data);
            });
        });
    }

    /**
     * Add default notification icon if not set
     */
    private addDefaultIconIfMissing(
        config: LocalNotificationConfig | LocalNotificationConfig[]
    ): LocalNotificationConfig | LocalNotificationConfig[] {
        const addIcon = (configElement: LocalNotificationConfig) => {
            if (!configElement.icon) {
                configElement.icon = 'res://icon.png';
            }
            if (!configElement.smallIcon) {
                configElement.smallIcon = 'res://notification.png';
            }
            if (!configElement.color) {
                configElement.color = '#d81b60';
            }
            return config;
        };

        if (config instanceof Array) {
            let configs: LocalNotificationConfig[];
            configs = (config as any).map((element: LocalNotificationConfig) => {
                return addIcon(element);
            });
            config = configs;
        } else {
            config = addIcon(config);
        }

        return config;
    }
}
