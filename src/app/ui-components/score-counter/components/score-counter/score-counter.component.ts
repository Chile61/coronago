import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { APP_ICONS } from '../../../icons/icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { ContactScore } from '../../../../core/entities/ContactScore';

@Component({
    selector: 'ui-score-counter',
    templateUrl: './score-counter.component.html',
    styleUrls: ['./score-counter.component.scss']
})
export class ScoreCounterComponent implements OnInit {
    @Input() contactScore: ContactScore;
    @Input() textBorderOffsetPx: number;
    @Input() icon: IconDefinition;
    @Input() showHintText = false;
    @Input() iconPosition: 'above' | 'below' = 'below';

    @ViewChild('container', { static: true }) scoreContainerElement: ElementRef;
    @ViewChild('scoreText', { static: true }) scoreTextElement: ElementRef;

    public icons = APP_ICONS;

    constructor() {}

    ngOnInit(): void {
        requestAnimationFrame(() => {
            this.adjustCounterSize();
        });
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
            console.warn('Element resized', scoreTextWidth, 'in', scoreTextWidth);
        }
    }
}
