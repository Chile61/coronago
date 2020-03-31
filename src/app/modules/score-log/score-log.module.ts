import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreLogRoutingModule } from './score-log-routing.module';
import { ScoreLogComponent } from './components/score-log/score-log.component';
import { IonicModule } from '@ionic/angular';
import { ScoreLogEntryModule } from '../../ui-components/score-log-entry/score-log-entry.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ScoreLogComponent],
    imports: [
        CommonModule,
        ScoreLogRoutingModule,
        IonicModule,
        ScoreLogEntryModule,
        TranslateModule
    ]
})
export class ScoreLogModule { }
