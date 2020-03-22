import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreCounterComponent } from './components/score-counter/score-counter.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NearbyScoreCounterComponent } from './components/nearby-score-counter/nearby-score-counter.component';

@NgModule({
    declarations: [ScoreCounterComponent, NearbyScoreCounterComponent],
    exports: [ScoreCounterComponent, NearbyScoreCounterComponent],
    imports: [CommonModule, FontAwesomeModule]
})
export class ScoreCounterModule {}
