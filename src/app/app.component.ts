import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BottomNavigationComponent } from './shared/components/bottom-navigation/bottom-navigation.component';
import { SideMenuComponent } from './shared/components/side-menu/side-menu.component';
import { SideMenuService } from './core/services/side-menu.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, BottomNavigationComponent, SideMenuComponent],
  template: `
    <div class="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div class="flex flex-1 overflow-hidden">
        <!-- Side Menu -->
        <aside
          class="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50"
          [class.translate-x-0]="isSideMenuOpen"
          [class.-translate-x-full]="!isSideMenuOpen">
          <app-side-menu></app-side-menu>
        </aside>

        <!-- Overlay -->
        <div
          *ngIf="isSideMenuOpen"
          (click)="toggleSideMenu()"
          class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
        </div>

        <div class="relative flex flex-col flex-1 w-full">
          <header *ngIf="!isHomePage && !isPracticeRoute" class="absolute top-0 left-0 p-0 z-10 lg:hidden">
            <button (click)="toggleSideMenu()" class="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </header>

          <!-- Main Content -->
          <main class="flex-1 overflow-y-auto" [class.p-4]="!isHomePage && !isPracticeRoute">
            <router-outlet></router-outlet>
          </main>

          <!-- Bottom Navigation -->
          <app-bottom-navigation></app-bottom-navigation>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'kabbalah-practice';
  isSideMenuOpen = false;
  isHomePage = false;
  isPracticeRoute = false;
  private subscription = new Subscription();

  constructor(private sideMenuService: SideMenuService, private router: Router) {}

  ngOnInit() {
    this.subscription.add(
      this.sideMenuService.isOpen$.subscribe(isOpen => {
        this.isSideMenuOpen = isOpen;
      })
    );

    // Track current route to hide burger button on home page and practice pages
    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        this.isHomePage = event.url === '/home' || event.url === '/';
        this.isPracticeRoute = event.url.includes('/practices/') ||
                               event.url.includes('/yichudim/');
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleSideMenu() {
    this.sideMenuService.toggle();
  }
}