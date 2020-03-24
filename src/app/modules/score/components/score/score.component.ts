import { Component, OnDestroy, OnInit } from '@angular/core';
import { APP_ICONS } from '../../../../ui-components/icons/icons';
import { CircleScoreSlot, CircleScoreSlotPosition, circleScoreSlots, hiddenSlot } from './circle-score-slots';
import { HelperService } from '../../../../services/helper.service';
import { ContactScore } from '../../../../core/entities/ContactScore';
import { LogManager } from '../../../../services/log.service';
import _orderBy from 'lodash.orderby';
import { UserService } from '../../../../services/api-services/user.service';
import { Subscription } from 'rxjs';
import { ObservableService } from '../../../../services/observable.service';
import { FlagService } from '../../../../services/flag.service';

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

    private simulateContactsFlag: boolean;
    private maxRenderDevicesFlag: number;
    private showAllAreaDevicesFlag: boolean;
    private userId: string;

    public nearbyScores: ContactScore[] = [];
    public contactScore: ContactScore = new ContactScore();
    public dangerLevel: 0 | 1 | 2 = 0;
    public countOfDangerContacts = 0;
    public countOfWarningContacts = 0;

    constructor(private userService: UserService, private flagService: FlagService) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.flagService.simulateContacts$.subscribe(value => {
                this.simulateContactsFlag = value;
                this.onConfigUpdated();
            }),
            this.flagService.maxRenderDevices$.subscribe(value => {
                this.maxRenderDevicesFlag = value;
                this.onConfigUpdated();
            }),
            this.flagService.showAllAreaDevices$.subscribe(value => {
                this.showAllAreaDevicesFlag = value;
                this.onConfigUpdated();
            }),
            this.flagService.localUserId$.subscribe((userId) => {
                this.userId = userId;
                this.getLocalUserScore();
            })
        );
    }

    ngOnDestroy(): void {
        ObservableService.unsubscribeFromAll(this.subscriptions);
    }

    /**
     * On config updated
     */
    public onConfigUpdated(): void {
        if (this.simulateContactsFlag === true) {
            this.simulateContacts();
        } else {
            this.detectNearbyContacts();
        }
    }

    /**
     * Get local user score from server
     */
    private getLocalUserScore(): void {
        this.contactScore = new ContactScore();
        this.contactScore.score = 0;

        this.userService.getUserScore(this.userId).subscribe(score => {
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
            if (this.showAllAreaDevicesFlag) {
                // Assign random tiny-slot
                const direction = contactScore.rssi <= -50 ? 'outer' : 'inner';
                const randomSlot = new CircleScoreSlotPosition();
                randomSlot.setRandomPosition(direction);
                contactScore.slot = randomSlot;
                contactScore.slotType = direction;
                contactScore.isTinySlot = true;
            } else {
                // Hidden slot
                contactScore.slot = hiddenSlot;
            }
        }

        return contactScore;
    }

    /**
     * Reset available slots
     */
    private resetAvailableSlots(): void {
        this.availableSlots = [].concat(circleScoreSlots);
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

        this.countOfDangerContacts = this.nearbyScores.filter(score => score.slotType === 'inner').length;
        this.countOfWarningContacts = this.nearbyScores.filter(score => score.slotType === 'outer').length;
    }

    /**
     * Simulate contacts/devices around
     */
    private simulateContacts() {
        let nearbyScores = [];
        this.resetAvailableSlots();

        // Simulate contacts
        for (let i = 0; i < this.maxRenderDevicesFlag; i++) {
            let contactScore = new ContactScore();
            contactScore.score = HelperService.randomIntFromInterval(4, 2000);
            contactScore.rssi = HelperService.randomIntFromInterval(-20, -90);
            contactScore.userId = HelperService.getRandomHexString(9);
            nearbyScores.push(contactScore);
        }

        nearbyScores = _orderBy(nearbyScores, ['rssi', 'score'], ['desc', 'desc']); // sort by signal, score
        nearbyScores = nearbyScores.map(contactScore => {
            return this.addAvailableSlot(contactScore);
        });

        this.nearbyScores = nearbyScores;
        this.updateDangerLevel();
    }

    /**
     * Detect nearby via bluetooth
     */
    private detectNearbyContacts(): void {
        this.resetAvailableSlots();
        this.nearbyScores = [];
    }
}
