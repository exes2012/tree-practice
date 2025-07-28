import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemindersRoutingModule } from './reminders-routing.module';
import { RemindersPageComponent } from './components/reminders-page/reminders-page.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RemindersRoutingModule,
    RemindersPageComponent
  ]
})
export class RemindersModule { }
