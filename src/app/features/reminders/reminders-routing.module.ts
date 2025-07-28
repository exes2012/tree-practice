import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemindersPageComponent } from './components/reminders-page/reminders-page.component';

const routes: Routes = [{ path: '', component: RemindersPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemindersRoutingModule { }
