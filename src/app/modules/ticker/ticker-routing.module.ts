import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TickerComponent } from './components/ticker/ticker.component';


const routes: Routes = [
    {
        path: '',
        component: TickerComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TickerRoutingModule { }
