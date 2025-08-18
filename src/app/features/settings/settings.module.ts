import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, SettingsRoutingModule, SettingsPageComponent],
})
export class SettingsModule {}
