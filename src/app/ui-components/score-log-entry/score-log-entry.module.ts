import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreLogEntryComponent } from './components/score-log-entry/score-log-entry.component';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [ScoreLogEntryComponent],
    exports: [ScoreLogEntryComponent],
    imports: [CommonModule, IonicModule, FontAwesomeModule]
})
export class ScoreLogEntryModule {}
