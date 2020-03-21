import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreLogRoutingModule } from './score-log-routing.module';
import { ScoreLogComponent } from './components/score-log/score-log.component';


@NgModule({
  declarations: [ScoreLogComponent],
  imports: [
    CommonModule,
    ScoreLogRoutingModule
  ]
})
export class ScoreLogModule { }
