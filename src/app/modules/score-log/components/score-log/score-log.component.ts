import { Component, OnInit } from '@angular/core';
import { LogEntry } from '../../../../ui-components/score-log-entry/components/score-log-entry/log-entry';
import { HelperService } from '../../../../services/helper.service';
import moment from 'moment-mini-ts';

@Component({
    selector: 'app-score-log',
    templateUrl: './score-log.component.html',
    styleUrls: ['./score-log.component.scss']
})
export class ScoreLogComponent implements OnInit {
    public logs: LogEntry[] = [];

    constructor() {}

    ngOnInit() {

        for (let i = 0; i < 50; i++) {
            const log = new LogEntry();
            log.contactScore = HelperService.getRandomNumber(3);
            log.contactTime = Date.now();
            log.scoreAccumulated = HelperService.getRandomNumber(5);
            log.contactTimeReadable = moment(log.contactTime).format('DD.MM.YY HH:mm:ss');
            this.logs.push(log);
        }
    }
}
