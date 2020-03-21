import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreRoutingModule } from './score-routing.module';
import { ScoreComponent } from './components/score/score.component';


@NgModule({
  declarations: [ScoreComponent],
  imports: [
    CommonModule,
    ScoreRoutingModule
  ]
})
export class ScoreModule { }
