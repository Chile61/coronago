import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebugRoutingModule } from './debug-routing.module';
import { DebugComponent } from './components/debug/debug.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [DebugComponent],
    imports: [
        CommonModule,
        DebugRoutingModule,
        IonicModule,
        FormsModule,
        FontAwesomeModule
    ]
})
export class DebugModule { }
