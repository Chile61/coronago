import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { APP_ICONS } from '../../../icons/icons';

@Component({
    selector: 'ui-score-counter',
    templateUrl: './score-counter.component.html',
    styleUrls: ['./score-counter.component.scss']
})
export class ScoreCounterComponent implements OnInit {
    @Input() score: number;
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
        const borderWidth = 120;
        const containerWidth = this.scoreContainerElement.nativeElement.offsetWidth - borderWidth;
        const scoreTextWidth = this.scoreTextElement.nativeElement.offsetWidth;

        if (scoreTextWidth > containerWidth) {
            const fontStyle = window.getComputedStyle(this.scoreTextElement.nativeElement, null).getPropertyValue('font-size');
            const fontSize = parseFloat(fontStyle);
            this.scoreTextElement.nativeElement.style.fontSize = fontSize - 2 + 'px';
            this.adjustCounterSize();
        } else {
            console.warn('scoreTextWidth', scoreTextWidth);
            console.warn('containerWidth', containerWidth);
        }
    }
}
