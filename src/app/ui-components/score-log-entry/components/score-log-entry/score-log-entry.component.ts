import { Component, Input, OnInit } from '@angular/core';
import { LogEntry } from './log-entry';
import { APP_ICONS } from '../../../icons/icons';

@Component({
    selector: 'ui-score-log-entry',
    templateUrl: './score-log-entry.component.html',
    styleUrls: ['./score-log-entry.component.scss']
})
export class ScoreLogEntryComponent implements OnInit {
    @Input() log: LogEntry;

    public icons = APP_ICONS;

    constructor() {}

    ngOnInit() {}
}
