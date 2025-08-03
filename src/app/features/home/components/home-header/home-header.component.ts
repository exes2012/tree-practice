import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SideMenuService } from '../../../../core/services/side-menu.service';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeHeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  private subscription = new Subscription();

  constructor(private sideMenuService: SideMenuService) {}

  ngOnInit() {
    this.subscription.add(
      this.sideMenuService.isOpen$.subscribe(isOpen => {
        this.isMenuOpen = isOpen;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onMenuToggle(): void {
    this.sideMenuService.toggle();
  }
}
