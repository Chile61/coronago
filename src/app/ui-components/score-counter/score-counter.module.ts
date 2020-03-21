import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreCounterComponent } from './components/score-counter/score-counter.component';

@NgModule({
    declarations: [ScoreCounterComponent],
    exports: [ScoreCounterComponent],
    imports: [CommonModule]
})
export class ScoreCounterModule {}
