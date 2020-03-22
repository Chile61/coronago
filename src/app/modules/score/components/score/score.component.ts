import { Component, OnInit } from '@angular/core';
import { APP_ICONS } from '../../../../ui-components/icons/icons';
import { CircleScoreSlot, circleScoreSlots } from './circle-score-slots';
import { NearbyScore } from '../../../../ui-components/score-counter/components/nearby-score/nearby-score.component';
import { HelperService } from '../../../../services/helper.service';

@Component({
    selector: 'app-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
    public icons = APP_ICONS;
    public nearbyScores: NearbyScore[] = [];
    public availableSlots = [].concat(circleScoreSlots);

    constructor() {}

    ngOnInit() {
        for (let i = 0; i < 8; i++) {
            const s = new NearbyScore();
            s.score = HelperService.randomIntFromInterval(400, 9999);
            s.slot = this.getAvailableSlot();
            s.rssi = HelperService.randomIntFromInterval(-30, -90);
            this.nearbyScores.push(s);
        }
    }

    /**
     * Get available circle slot
     */
    public getAvailableSlot(): CircleScoreSlot {
        if (this.availableSlots.length) {
            const slot = Object.assign({}, this.availableSlots[0]);
            // this.availableSlots.splice(0, 1);
            this.availableSlots = this.availableSlots.slice(1);
            console.warn('slot', slot);
            return slot;
        }
    }
}
