import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageBoxRoutingModule } from './message-box-routing.module';
import { MessageBoxComponent } from './components/message-box/message-box.component';


@NgModule({
  declarations: [MessageBoxComponent],
  imports: [
    CommonModule,
    MessageBoxRoutingModule
  ]
})
export class MessageBoxModule { }
