import { Component, OnInit } from '@angular/core';
import { APP_ICONS } from '../../../../ui-components/icons/icons';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-infection',
    templateUrl: './infection.component.html',
    styleUrls: ['./infection.component.scss'],
})
export class InfectionComponent implements OnInit {
    public icons = APP_ICONS;
    public toggleDemoText: boolean;

    constructor() {}

    ngOnInit() {}

    /**
     * On click demo text toggle, switch text in dev env
     */
    public onDemoTextToggle(): void {
        if (!environment.production) {
            this.toggleDemoText = !this.toggleDemoText;
        }
    }
}
