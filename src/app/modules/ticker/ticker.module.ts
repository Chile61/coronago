import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TickerRoutingModule } from './ticker-routing.module';
import { TickerComponent } from './components/ticker/ticker.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [TickerComponent],
    imports: [
        CommonModule,
        TickerRoutingModule,
        IonicModule
    ]
})
export class TickerModule { }
