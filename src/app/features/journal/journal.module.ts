import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JournalRoutingModule } from './journal-routing.module';
import { JournalPageComponent } from './components/journal-page/journal-page.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    JournalRoutingModule,
    JournalPageComponent
  ]
})
export class JournalModule { }
