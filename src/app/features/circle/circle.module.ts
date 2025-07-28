import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CircleRoutingModule } from './circle-routing.module';
import { CirclePageComponent } from './components/circle-page/circle-page.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CircleRoutingModule,
    CirclePageComponent
  ]
})
export class CircleModule { }
