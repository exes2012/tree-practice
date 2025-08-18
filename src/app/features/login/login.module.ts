import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginPageComponent } from './components/login-page/login-page.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, LoginRoutingModule, LoginPageComponent],
})
export class LoginModule {}
