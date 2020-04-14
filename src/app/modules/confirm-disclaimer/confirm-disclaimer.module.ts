import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmDisclaimerRoutingModule } from './confirm-disclaimer-routing.module';
import { ConfirmDisclaimerComponent } from './components/confirm-disclaimer/confirm-disclaimer.component';
import { IonicModule } from '@ionic/angular';
import { DisclaimerModule } from '../../ui-components/disclaimer/disclaimer.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [ConfirmDisclaimerComponent],
    imports: [CommonModule, ConfirmDisclaimerRoutingModule, IonicModule, DisclaimerModule, TranslateModule]
})
export class ConfirmDisclaimerModule {}
