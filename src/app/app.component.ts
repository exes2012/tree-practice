import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BottomNavigationComponent } from './shared/components/bottom-navigation/bottom-navigation.component';
import { SideMenuComponent } from './shared/components/side-menu/side-menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, BottomNavigationComponent, SideMenuComponent],
  template: `
    <!-- Kabbalah Practice PWA App -->
    <div class="app-container h-screen bg-gray-50 flex flex-col overflow-hidden">
      <!-- Side Menu Overlay -->
      <div
        *ngIf="isSideMenuOpen"
        class="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-all duration-300"
        (click)="closeSideMenu()">
      </div>

      <!-- Side Menu -->
      <div
        class="fixed top-0 left-0 h-full w-80 glass-effect shadow-2xl transition-all duration-300 z-50"
        [class.side-menu-open]="isSideMenuOpen"
        [class.side-menu-closed]="!isSideMenuOpen">
        <app-side-menu (closeMenu)="closeSideMenu()"></app-side-menu>
      </div>

      <!-- Floating Menu Button -->
      <button
        (click)="toggleSideMenu()"
        class="fixed top-4 left-4 z-30 p-3 bg-gradient-purple rounded-xl shadow-purple hover:shadow-glow transition-all duration-200 group">
        <svg class="icon-md text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <!-- Main Content -->
      <main class="flex-1 overflow-hidden">
        <router-outlet></router-outlet>
      </main>

      <!-- Bottom Navigation -->
      <app-bottom-navigation></app-bottom-navigation>
    </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'kabbalah-practice';
  isSideMenuOpen = false;

  toggleSideMenu() {
    this.isSideMenuOpen = !this.isSideMenuOpen;
  }

  closeSideMenu() {
    this.isSideMenuOpen = false;
  }
}
