import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [DisclaimerComponent],
  exports: [DisclaimerComponent],
    imports: [
        CommonModule,
        TranslateModule
    ]
})
export class DisclaimerModule { }
