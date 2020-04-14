import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfectionComponent } from './components/infection/infection.component';


const routes: Routes = [
    {
        path: '',
        component: InfectionComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfectionRoutingModule { }
