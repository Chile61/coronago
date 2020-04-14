import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfectionRoutingModule } from './infection-routing.module';
import { InfectionComponent } from './components/infection/infection.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
      InfectionComponent
  ],
    imports: [
        CommonModule,
        InfectionRoutingModule,
        FontAwesomeModule,
        IonicModule
    ]
})
export class InfectionModule { }
