import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TheoryPageComponent } from './components/theory-page/theory-page.component';

const routes: Routes = [{ path: '', component: TheoryPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TheoryRoutingModule {}
