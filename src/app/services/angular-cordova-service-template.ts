import { Injectable } from '@angular/core';
import { CordovaPlugin } from './cordova-plugin';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class AngularServiceTemplateClass extends CordovaPlugin {
    constructor(private platform: Platform) {
        super();
    }

    /**
     * Init() must be registered in boot.service to launch at app start
     */
    public async init(): Promise<void> {
      await this.platform.ready();  
      this.do();
    }

    private async do(): Promise<void> {
        // Hi i am here
    }
}
