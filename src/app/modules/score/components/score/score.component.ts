import { Component, OnDestroy, OnInit } from '@angular/core';
import { APP_ICONS } from '../../../../ui-components/icons/icons';
import { CircleScoreSlot, CircleScoreSlotPosition, circleScoreSlots, hiddenSlot } from './circle-score-slots';
import { HelperService } from '../../../../services/helper.service';
import { ContactScore } from '../../../../core/entities/ContactScore';
import { LogManager } from '../../../../services/log.service';
import _sortBy from 'lodash.sortby';
import _orderBy from 'lodash.orderby';
import { UserService } from '../../../../services/api-services/user.service';
import { Subscription } from 'rxjs';
import { ObservableService } from '../../../../services/observable.service';

@Component({
    selector: 'app-score',
    templateUrl: './score.component.html',
    styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit, OnDestroy {
    private log = new LogManager('ScoreComponent');
    private subscriptions: Subscription[] = [];

    public icons = APP_ICONS;

    public availableSlots: CircleScoreSlot[] = [].concat(circleScoreSlots);

    public nearbyScores: ContactScore[] = [];
    public contactScore: ContactScore;
    public dangerLevel: 0 | 1 | 2 = 0;

    constructor(private userService: UserService) {}

    ngOnInit(): void {
        // Simulate neighbours
        for (let i = 0; i < 10; i++) {
            let contactScore = new ContactScore();
            contactScore.score = HelperService.randomIntFromInterval(4, 2000);
            contactScore.rssi = HelperService.randomIntFromInterval(-20, -90);
            this.nearbyScores.push(contactScore);
        }

        this.nearbyScores = _orderBy(this.nearbyScores, ['rssi', 'score'], ['desc', 'desc']); // sort by signal, score
        this.nearbyScores = this.nearbyScores.map(contactScore => {
            return this.addAvailableSlot(contactScore);
        });

        this.subscriptions.push(this.userService.localUserIdLoaded.subscribe(() => this.loadLocalUserScore()));
        this.updateDangerLevel();
    }

    ngOnDestroy(): void {
        ObservableService.unsubscribeFromAll(this.subscriptions);
    }

    /**
     * Get local user score from server
     */
    private loadLocalUserScore() {
        this.contactScore = new ContactScore();
        this.contactScore.score = 0;

        this.userService.getUserScore(this.userService.localUserId).subscribe(score => {
            if (score) {
                this.contactScore.score = score.networkSize;
            }
        });
    }

    /**
     * Get available circle slot
     */
    public addAvailableSlot(contactScore: ContactScore): ContactScore {
        if (this.availableSlots.length) {
            // Assign next slot
            const slot = Object.assign({}, this.availableSlots[0]);
            this.availableSlots = this.availableSlots.slice(1);

            if (contactScore.rssi <= -50) {
                contactScore.slot = slot.outer;
                contactScore.slotType = 'outer';
            } else {
                contactScore.slot = slot.inner;
                contactScore.slotType = 'inner';
            }
        } else {
            // Assign random tiny-slot
            // const direction = contactScore.rssi <= -50 ? 'outer' : 'inner';
            // const randomSlot = new CircleScoreSlotPosition();
            // randomSlot.setRandomPosition(direction);
            // contactScore.slot = randomSlot;
            // contactScore.slotType = direction;
            // contactScore.isTinySlot = true;

            // Hidden slot
            contactScore.slot = hiddenSlot;
        }

        return contactScore;
    }

    /**
     * Update danger level
     */
    private updateDangerLevel(): void {
        let isWarning = false;
        let isDanger = false;

        for (const score of this.nearbyScores) {
            if (score.slotType === 'outer') {
                isWarning = true;
            } else if (score.slotType === 'inner') {
                isDanger = true;
                break;
            }
        }

        if (isDanger) {
            this.dangerLevel = 2;
        } else if (isWarning) {
            this.dangerLevel = 1;
        } else {
            this.dangerLevel = 0;
        }
    }
}
