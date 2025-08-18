import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemindersPageComponent } from './components/reminders-page/reminders-page.component';
import { ReminderCreatePageComponent } from './components/reminder-create-page/reminder-create-page.component';

const routes: Routes = [
  { path: '', component: RemindersPageComponent },
  { path: 'new', component: ReminderCreatePageComponent },
  { path: 'edit/:id', component: ReminderCreatePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemindersRoutingModule {}
