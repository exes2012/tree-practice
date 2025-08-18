import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiaryRoutingModule } from './diary-routing.module';
import { DiaryPageComponent } from './components/diary-page/diary-page.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, DiaryRoutingModule, DiaryPageComponent],
})
export class DiaryModule {}
