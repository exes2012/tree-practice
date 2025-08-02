import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YichudimPageComponent } from './components/yichudim-page/yichudim-page.component';

const routes: Routes = [{ path: '', component: YichudimPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YichudimRoutingModule { }