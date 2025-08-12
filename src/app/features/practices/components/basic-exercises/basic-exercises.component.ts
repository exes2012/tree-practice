
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PracticeListComponent, PracticeCard } from '@app/shared/components/practice-list/practice-list.component';
import { PracticePageLayoutComponent } from '@app/shared/components/practice-page-layout/practice-page-layout.component';

@Component({
  selector: 'app-basic-exercises',
  templateUrl: './basic-exercises.component.html',
  styleUrls: ['./basic-exercises.component.scss'],
  standalone: true,
  imports: [CommonModule, PracticeListComponent, PracticePageLayoutComponent]
})
export class BasicExercisesComponent {
  practices: PracticeCard[] = [
    { title: 'Настройка на свет', route: '/practices/basic/keter-tuning', icon: 'wb_sunny', colorClass: 'bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800', author: 'Валентин Янишевский', tagColorClass: 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200' },
    { title: '4 стадии прямого света', route: '/practices/basic/four-stages', icon: 'auto_awesome', colorClass: 'bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800', author: 'Валентин Янишевский', tagColorClass: 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200' },
    { title: 'Работа в отраженном свете', route: '/practices/runner/reflected-light', icon: 'light_mode', colorClass: 'bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800', author: 'Валентин Янишевский', tagColorClass: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200' },
  ];

  constructor(private router: Router) {}

  onPracticeSelected(practice: PracticeCard) {
    this.router.navigate([practice.route]);
  }
}
