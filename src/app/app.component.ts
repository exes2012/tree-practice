import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BottomNavigationComponent } from './shared/components/bottom-navigation/bottom-navigation.component';
import { ReminderService } from './core/services/reminder.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, BottomNavigationComponent],
  template: `
    <div
      class="flex h-screen flex-col"
      [ngClass]="!isLoginRoute ? 'surface' : 'bg-gray-50'"
    >
      <div class="flex flex-1 overflow-hidden">
        <div class="relative flex w-full flex-1 flex-col">
          <!-- Main Content -->
          <main class="flex-1 overflow-y-auto">
            <router-outlet></router-outlet>
          </main>

          <!-- Bottom Navigation -->
          <app-bottom-navigation
            *ngIf="!isGoalsRoute && !isPracticeRoute && !isLoginRoute"
          ></app-bottom-navigation>
        </div>
      </div>
    </div>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'kabbalah-practice';
  isHomePage = false;
  isPracticeRoute = false;
  isGoalsRoute = false;
  isLoginRoute = false;
  private subscription = new Subscription();

  constructor(
    private router: Router,
    private reminders: ReminderService
  ) {}

  async ngOnInit() {
    // Track current route for navigation logic
    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.isHomePage = event.url === '/home' || event.url === '/';
          const isNotesRoute = event.url.includes('/notes');
          const isDiaryRoute = event.url.includes('/diary');
          const isRemindersRoute = event.url.includes('/reminders');
          this.isPracticeRoute =
            event.url.includes('/practices/') ||
            event.url.includes('/yichudim/') ||
            (event.url.includes('/goals/') &&
              (event.url.includes('/practice/') ||
                event.url.includes('/new') ||
                event.url.includes('/edit') ||
                event.url.includes('/add-practice'))) ||
            isNotesRoute ||
            isDiaryRoute;
          this.isGoalsRoute =
            event.url === '/goals' ||
            (event.url.includes('/goals/') &&
              !event.url.includes('/practice/') &&
              !event.url.includes('/new') &&
              !event.url.includes('/edit') &&
              !event.url.includes('/add-practice') &&
              event.url.split('/').length === 3); // /goals/:id
          this.isLoginRoute = event.url.startsWith('/login');
        })
    );

    // Init in-app reminder schedule
    await this.reminders.init();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
