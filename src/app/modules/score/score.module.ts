import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreRoutingModule } from './score-routing.module';
import { ScoreComponent } from './components/score/score.component';
import { IonicModule } from '@ionic/angular';
import { ScoreCounterModule } from '../../ui-components/score-counter/score-counter.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [ScoreComponent],
    imports: [
        CommonModule,
        ScoreRoutingModule,
        IonicModule,
        ScoreCounterModule,
        FontAwesomeModule,
        TranslateModule
    ]
})
export class ScoreModule { }
