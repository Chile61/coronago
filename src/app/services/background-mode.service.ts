import { Injectable } from '@angular/core';
import { CordovaPlugin } from './cordova-plugin';
import { Platform } from '@ionic/angular';

interface BackgroundModeInterface {
    // The plugin is not enabled by default. Once it has been enabled the mode becomes active if the app moves to background.
    enable: () => void;
    setEnabled: (value: boolean) => void;

    // To disable the background mode:
    disable: () => void;

    // Once the plugin has been enabled and the app has entered the background, the background mode becomes active.
    isActive: () => boolean;

    // Listen for event
    on: (event: 'enable' | 'disable' | 'activate' | 'deactivate' | 'failure', callback: () => void) => void;

    // Remove event listener
    un: (event: 'enable' | 'disable' | 'activate' | 'deactivate' | 'failure', callback: () => void) => void;

    /**
     * ANDROID specific
     */
    // Transit between application states: Android allows to programmatically move from foreground to background or vice versa.
    moveToBackground: () => void;
    moveToForeground: () => void;

    // Back button: Override the back button on Android to go to background instead of closing the app.
    overrideBackButton: () => void;

    // Recent task list: Exclude the app from the recent task list works on Android 5.0+.
    excludeFromTaskList: () => void;

    setDefaults: (config: { [prop: string]: any }) => void;
    getSettings: () => any;

    // Note: Calling the method led to increased resource and power consumption.
    disableWebViewOptimizations: () => void;
    disableBatteryOptimizations: () => void;
}

@Injectable({
    providedIn: 'root',
})
export class BackgroundModeService extends CordovaPlugin {
    protected cordovaPlugin: BackgroundModeInterface;

    constructor(private platform: Platform) {
        super();
        this.setCordovaPlugin('backgroundMode');
    }

    public async init(): Promise<void> {
        await this.platform.ready();

        if (!this.isPluginAvailable()) {
            return;
        }

        await this.do();
    }

    public do(): void {
        this.cordovaPlugin.enable();
        this.cordovaPlugin.excludeFromTaskList();
        this.cordovaPlugin.overrideBackButton();
        this.cordovaPlugin.disableBatteryOptimizations();
        this.cordovaPlugin.disableWebViewOptimizations();
        // this.cordovaPlugin.moveToForeground();


        if (this.platform.is('android')) {
            this.cordovaPlugin.setDefaults({ silent: true });
        }
    }
}
