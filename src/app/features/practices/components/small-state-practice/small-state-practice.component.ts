
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PracticeListComponent, PracticeCard } from '@app/shared/components/practice-list/practice-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { PracticePageLayoutComponent } from '@app/shared/components/practice-page-layout/practice-page-layout.component';

@Component({
  selector: 'app-small-state-practice',
  templateUrl: './small-state-practice.component.html',
  standalone: true,
  imports: [CommonModule, PracticeListComponent, SharedModule, PracticePageLayoutComponent]
})
export class SmallStatePracticeComponent {
  practices: PracticeCard[] = [
    { title: 'Пространство с Творцом', route: '/practices/small-state/creator-space', icon: 'hub', colorClass: 'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800', author: 'Гмар Тиккун', tagColorClass: 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' },
    { title: 'Пространство Зеир Анпина', route: '/practices/small-state/zeir-anpin-space', icon: 'filter_center_focus', colorClass: 'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800', author: 'Гмар Тиккун', tagColorClass: 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' },
    { title: 'Средняя линия Нецах/Ход', route: '/practices/small-state/netz-hod-line', icon: 'linear_scale', colorClass: 'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800', author: 'Гмар Тиккун', tagColorClass: 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' },
    { title: 'Средняя линия Хесед/Гвура', route: '/practices/small-state/hesed-gevurah-line', icon: 'commit', colorClass: 'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800', author: 'Гмар Тиккун', tagColorClass: 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200' },
  ];

  constructor(private router: Router) {}

  onPracticeSelected(practice: PracticeCard) {
    this.router.navigate([practice.route]);
  }
}
