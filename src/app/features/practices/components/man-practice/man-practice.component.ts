import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  PracticeListComponent,
  PracticeCard,
} from '@app/shared/components/practice-list/practice-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { PracticePageLayoutComponent } from '@app/shared/components/practice-page-layout/practice-page-layout.component';

@Component({
  selector: 'app-man-practice',
  templateUrl: './man-practice.component.html',
  standalone: true,
  imports: [CommonModule, PracticeListComponent, SharedModule, PracticePageLayoutComponent],
})
export class ManPracticeComponent {
  practices: PracticeCard[] = [
    {
      title: 'Подъем МАН с конкретным запросом',
      route: '/practices/runner/specific-request',
      icon: 'help_outline',
      colorClass: 'bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800',
      author: 'Гмар Тиккун',
      tagColorClass: 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200',
    },
    {
      title: 'Подъем МАН с конкретным запросом V2',
      route: '/practices/runner/specific-request-copy',
      icon: 'help_outline',
      colorClass: 'bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800',
      author: 'Гмар Тиккун',
      tagColorClass: 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200',
    },
    {
      title: 'Работа со здоровьем',
      route: '/practices/runner/health-work',
      icon: 'healing',
      colorClass: 'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800',
      author: 'Гмар Тиккун',
      tagColorClass: 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200',
    },
    {
      title: 'Работа с привычками',
      route: '/practices/runner/habits-work',
      icon: 'psychology',
      colorClass: 'bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 dark:hover:bg-orange-800',
      author: 'Гмар Тиккун',
      tagColorClass: 'bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200',
    },
    {
      title: 'Интеграция тени',
      route: '/practices/runner/shadow-integration',
      icon: 'person_search',
      colorClass: 'bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800',
      author: 'Гмар Тиккун',
      tagColorClass: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200',
    },
    {
      title: 'Подъем МАН через общее поле Шхины',
      route: '/practices/runner/shekhinah-field',
      icon: 'groups',
      colorClass: 'bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800',
      author: 'Гмар Тиккун',
      tagColorClass: 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200',
    },
  ];

  constructor(private router: Router) {}

  onPracticeSelected(practice: PracticeCard) {
    this.router.navigate([practice.route]);
  }
}
