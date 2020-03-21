import { Component } from '@angular/core';
import { APP_ICONS } from '../../ui-components/icons/icons';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {
    public icons = APP_ICONS;

    constructor() {}
}
