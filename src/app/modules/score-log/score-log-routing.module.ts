import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScoreLogComponent } from './components/score-log/score-log.component';

const routes: Routes = [
    {
        path: '',
        component: ScoreLogComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScoreLogRoutingModule {}
