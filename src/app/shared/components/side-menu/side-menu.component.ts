import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideMenuService } from '../../../core/services/side-menu.service';

@Component({
  selector: 'app-side-menu',
  imports: [RouterModule],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent {
  constructor(private sideMenuService: SideMenuService) {}

  onCloseMenu() {
    this.sideMenuService.close();
  }
}
