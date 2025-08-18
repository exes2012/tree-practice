import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemindersRoutingModule } from './reminders-routing.module';
import { RemindersPageComponent } from './components/reminders-page/reminders-page.component';
import { ReminderCreatePageComponent } from './components/reminder-create-page/reminder-create-page.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RemindersRoutingModule,
    RemindersPageComponent,
    ReminderCreatePageComponent
  ]
})
export class RemindersModule { }
