import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmDisclaimerComponent } from './components/confirm-disclaimer/confirm-disclaimer.component';


const routes: Routes = [
    {
        path: '',
        component: ConfirmDisclaimerComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmDisclaimerRoutingModule { }
