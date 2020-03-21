import { Component, OnInit } from '@angular/core';
import { APP_ICONS } from '../../../../ui-components/icons/icons';

@Component({
    selector: 'app-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
    public icons = APP_ICONS;

    constructor() {}

    ngOnInit() {}
}
