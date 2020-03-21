import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'ui-score-counter',
    templateUrl: './score-counter.component.html',
    styleUrls: ['./score-counter.component.scss']
})
export class ScoreCounterComponent implements OnInit {
    @Input() score: number;

    constructor() {}

    ngOnInit() {}
}
