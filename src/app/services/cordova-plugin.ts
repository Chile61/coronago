import _ from 'lodash';

/**
 * Cordova plugin base class for service interfaces
 */
export abstract class CordovaPlugin {
    private logDomainStyle = 'background:green; color: white; font-weight: bold; padding: 4px;';
    protected pluginName: string;
    protected cordovaPlugin: any;

    /**
     * Log interface object
     */
    protected exposePluginDetails(): void {
        document.addEventListener(
            'deviceready',
            () => {
                console.log('%c[CordovaPlugin] ' + this.pluginName, this.logDomainStyle, this.cordovaPlugin);
            },
            false
        );
    }

    /**
     * Set save interface
     */
    protected setCordovaPlugin(propertyName: string): void {
        this.pluginName = propertyName;

        document.addEventListener(
            'deviceready',
            () => {
                this.cordovaPlugin = _.get(window.cordova.plugins, propertyName);
                this.exposePluginDetails();
            },
            false
        );
    }

    /**
     * Check is plugin available
     */
    protected isPluginAvailable(): boolean {
        if (!this.cordovaPlugin) {
            console.error('%c[CordovaPlugin] ' + this.pluginName, this.logDomainStyle, 'is not available!');
        }
        return !!this.cordovaPlugin;
    }

    /**
     * Run method on plugin api
     */
    protected method(name: string): any {
        document.addEventListener(
            'deviceready',
            () => {
                const result = this.cordovaPlugin[name]((data: any) => {
                    if (data) {
                        console.warn(this.pluginName, name, data);
                    }
                });
                if (result !== undefined) {
                    console.warn(this.pluginName, name, result);
                }
            },
            false
        );
    }
}
