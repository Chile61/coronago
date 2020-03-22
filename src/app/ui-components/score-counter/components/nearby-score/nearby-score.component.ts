import { Component, Input, OnInit } from '@angular/core';
import { APP_ICONS } from '../../../icons/icons';
import { CircleScoreSlot } from '../../../../modules/score/components/score/circle-score-slots';

export class NearbyScore {
    slot: CircleScoreSlot;
    score: number;
    rssi: number;
}

@Component({
    selector: 'ui-nearby-score',
    templateUrl: './nearby-score.component.html',
    styleUrls: ['./nearby-score.component.scss']
})
export class NearbyScoreComponent implements OnInit {
    @Input() nearbyScore: NearbyScore;

    public icons = APP_ICONS;

    constructor() {}

    ngOnInit() {}
}
