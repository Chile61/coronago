import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreCounterComponent } from './components/score-counter/score-counter.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [ScoreCounterComponent],
    exports: [ScoreCounterComponent],
    imports: [CommonModule, FontAwesomeModule]
})
export class ScoreCounterModule {}
