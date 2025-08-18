import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TheoryRoutingModule } from './theory-routing.module';
import { TheoryPageComponent } from './components/theory-page/theory-page.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, TheoryRoutingModule, TheoryPageComponent],
})
export class TheoryModule {}
