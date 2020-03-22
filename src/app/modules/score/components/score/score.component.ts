import { Component, OnInit } from '@angular/core';
import { APP_ICONS } from '../../../../ui-components/icons/icons';
import { hiddenSlot, innerCircleScoreSlots, outerCircleScoreSlots } from './circle-score-slots';
import { HelperService } from '../../../../services/helper.service';
import { ContactScore } from '../../../../core/entities/ContactScore';
import { LogManager } from '../../../../services/log.service';

@Component({
    selector: 'app-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
    private log = new LogManager('ScoreComponent');

    public icons = APP_ICONS;
    public nearbyScores: ContactScore[] = [];
    public availableOuterSlots = [].concat(outerCircleScoreSlots);
    public availableInnerSlots = [].concat(innerCircleScoreSlots);
    public contactScore: ContactScore;

    constructor() {}

    ngOnInit() {
        for (let i = 0; i < 30; i++) {
            let contactScore = new ContactScore();
            contactScore.score = HelperService.randomIntFromInterval(40055, 2465216);
            contactScore.rssi = HelperService.randomIntFromInterval(-30, -90);
            contactScore = this.addAvailableSlot(contactScore);
            this.nearbyScores.push(contactScore);
        }

        this.contactScore = new ContactScore();
        this.contactScore.score = 1928384;
    }

    /**
     * Get available circle slot
     */
    public addAvailableSlot(contactScore: ContactScore): ContactScore {
        if (contactScore.rssi <= -50) {
            if (this.availableInnerSlots.length) {
                const slot = Object.assign({}, this.availableInnerSlots[0]);
                this.availableInnerSlots = this.availableInnerSlots.slice(1);
                contactScore.slot = slot;
                contactScore.slotType = 'inner';
            } else {
                this.log.warn(this.addAvailableSlot.name, 'Skipping contactScore because out of slots');
                contactScore.slot = hiddenSlot;
                contactScore.slotType = 'hidden';
            }
        } else {
            if (this.availableOuterSlots.length) {
                const slot = Object.assign({}, this.availableOuterSlots[0]);
                this.availableOuterSlots = this.availableOuterSlots.slice(1);
                contactScore.slot = slot;
                contactScore.slotType = 'outer';
            } else {
                this.log.warn(this.addAvailableSlot.name, 'Skipping contactScore because out of slots');
                contactScore.slot = hiddenSlot;
                contactScore.slotType = 'hidden';
            }
        }

        return contactScore;
    }
}
