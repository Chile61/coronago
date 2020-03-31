import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { APP_ICONS } from '../../../icons/icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { ContactScore } from '../../../../core/entities/ContactScore';
import { LogManager } from '../../../../services/log.service';
import { Subscription } from 'rxjs';
import { ObservableService } from '../../../../services/observable.service';
import { FlagService } from '../../../../services/flag.service';
import { I18nService } from '../../../../services/i18n.service';

@Component({
    selector: 'ui-score-counter',
    templateUrl: './score-counter.component.html',
    styleUrls: ['./score-counter.component.scss'],
})
export class ScoreCounterComponent implements OnInit, OnDestroy {
    private log = new LogManager('ScoreCounterComponent');
    public i18n = I18nService;
    private subscriptions: Subscription[] = [];
    public icons = APP_ICONS;

    @Input() contactScore: ContactScore;
    @Input() textBorderOffsetPx: number;
    @Input() icon: IconDefinition;
    @Input() showHintText = false;
    @Input() iconPosition: 'above' | 'below' = 'below';

    @ViewChild('container', { static: false }) scoreContainerElement: ElementRef;
    @ViewChild('scoreText', { static: false }) scoreTextElement: ElementRef;

    public showNodeDebugInfo: boolean;

    constructor(private flagService: FlagService) {}

    ngOnInit(): void {
        requestAnimationFrame(() => {
            setTimeout(() => {
                this.adjustCounterSize();
            }, 200);
        });

        this.subscriptions.push(
            this.flagService.showNodeDebugInfo$.subscribe((value) => {
                this.showNodeDebugInfo = value;
            })
        );
    }

    ngOnDestroy(): void {
        ObservableService.unsubscribeFromAll(this.subscriptions);
    }

    /**
     * Adjust counter size
     */
    public adjustCounterSize(): void {
        const borderWidth = this.textBorderOffsetPx || 120;

        const containerWidthStr = window.getComputedStyle(this.scoreContainerElement.nativeElement).getPropertyValue('width');
        const containerWidth = parseInt(containerWidthStr, 10) - borderWidth;
        const scoreTextWidthStr = window.getComputedStyle(this.scoreTextElement.nativeElement).getPropertyValue('width');
        const scoreTextWidth = parseInt(scoreTextWidthStr, 10);

        if (scoreTextWidth === 0 || containerWidth === 0) {
            return;
        }

        if (scoreTextWidth > containerWidth) {
            const fontStyle = window.getComputedStyle(this.scoreTextElement.nativeElement).getPropertyValue('font-size');
            const fontSize = parseFloat(fontStyle);
            this.scoreTextElement.nativeElement.style.fontSize = fontSize - 2 + 'px';
            this.adjustCounterSize();
        } else {
            // this.log.warn('adjustCounterSize', 'Element resized', scoreTextWidth, 'in', scoreTextWidth);
        }
    }
}
