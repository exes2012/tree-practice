import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PracticeListComponent, PracticeCard } from '@app/shared/components/practice-list/practice-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { PracticePageLayoutComponent } from '@app/shared/components/practice-page-layout/practice-page-layout.component';

@Component({
  selector: 'app-man-practice',
  templateUrl: './man-practice.component.html',
  standalone: true,
  imports: [CommonModule, PracticeListComponent, SharedModule, PracticePageLayoutComponent]
})
export class ManPracticeComponent {
  practices: PracticeCard[] = [
    { title: 'Подъем МАН с конкретным запросом', route: '/practices/man/specific-request', icon: 'help_outline', colorClass: 'bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800', author: 'Гмар Тиккун', tagColorClass: 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' },
    { title: 'Подъем МАН с конкретным запросом v2', route: '/practices/man/specific-request-v2', icon: 'help_outline', colorClass: 'bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800', author: 'Гмар Тиккун', tagColorClass: 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' },
    { title: 'Подъем МАН через прояснение пространства', route: '', icon: 'psychology', colorClass: 'bg-red-100 dark:bg-red-900', disabled: true, author: 'Гмар Тиккун', tagColorClass: 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' },
    { title: 'Подъем МАН через общее поле Шхины', route: '/practices/man/shekhinah-field', icon: 'groups', colorClass: 'bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800', author: 'Гмар Тиккун', tagColorClass: 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' },
    { title: 'В чем я не оправдываю Творца', route: '', icon: 'gavel', colorClass: 'bg-red-100 dark:bg-red-900', disabled: true, author: 'Гмар Тиккун', tagColorClass: 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200' },
  ];

  constructor(private router: Router) {}

  onPracticeSelected(practice: PracticeCard) {
    this.router.navigate([practice.route]);
  }
}