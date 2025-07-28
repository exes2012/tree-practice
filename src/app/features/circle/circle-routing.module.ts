import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CirclePageComponent } from './components/circle-page/circle-page.component';

const routes: Routes = [{ path: '', component: CirclePageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CircleRoutingModule { }
