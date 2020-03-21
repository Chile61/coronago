import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';



@NgModule({
  declarations: [DisclaimerComponent],
  exports: [DisclaimerComponent],
  imports: [
    CommonModule
  ]
})
export class DisclaimerModule { }
