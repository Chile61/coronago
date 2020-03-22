import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreCounterComponent } from './components/score-counter/score-counter.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NearbyScoreComponent } from './components/nearby-score/nearby-score.component';

@NgModule({
    declarations: [ScoreCounterComponent, NearbyScoreComponent],
    exports: [ScoreCounterComponent, NearbyScoreComponent],
    imports: [CommonModule, FontAwesomeModule]
})
export class ScoreCounterModule {}
