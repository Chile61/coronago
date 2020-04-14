import { Component, Input, OnInit } from '@angular/core';
import { APP_ICONS } from '../../../icons/icons';
import { ContactScore } from '../../../../core/entities/ContactScore';

@Component({
    selector: 'ui-nearby-score-counter',
    templateUrl: './nearby-score-counter.component.html',
    styleUrls: ['./nearby-score-counter.component.scss']
})
export class NearbyScoreCounterComponent implements OnInit {

    @Input() isSatellite = false;
    @Input() nearbyContactScore: ContactScore;

    public icons = APP_ICONS;

    constructor() {}

    ngOnInit() {}
}
