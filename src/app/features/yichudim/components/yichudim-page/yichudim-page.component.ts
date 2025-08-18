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
  selector: 'app-yichudim-page',
  templateUrl: './yichudim-page.component.html',
  standalone: true,
  imports: [CommonModule, PracticeListComponent, SharedModule, PracticePageLayoutComponent],
})
export class YichudimPageComponent {
  practices: PracticeCard[] = [
    {
      title: '72 Имени Творца',
      route: '/practices/runner/seventy-two-names-yichud',
      icon: 'auto_awesome',
      colorClass: 'bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800',
      tagColorClass: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200',
      author: 'РАДАФ',
    },
    {
      title: 'Дышать радостью',
      route: '/practices/runner/breathing-joy-yichud',
      icon: 'auto_awesome',
      colorClass: 'bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800',
      tagColorClass: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200',
      author: 'р. Ицхак Гинзбург',
    },
    {
      title: 'Пламя свечи',
      route: '/practices/runner/candle-flame-yichud',
      icon: 'auto_awesome',
      colorClass: 'bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800',
      tagColorClass: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200',
      author: 'р. Ицхак Гинзбург',
    },
    {
      title: 'Божественное пространство',
      route: '/practices/runner/divine-space-yichud',
      icon: 'auto_awesome',
      colorClass: 'bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800',
      tagColorClass: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200',
      author: 'р. Ицхак Гинзбург',
    },
    {
      title: 'Благодарность',
      route: '/practices/runner/gratitude-yichud',
      icon: 'auto_awesome',
      colorClass: 'bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800',
      tagColorClass: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200',
      author: 'р. Ицхак Гинзбург',
    },
    {
      title: 'Любовь (א ה ב ה)',
      route: '/practices/runner/love-yichud',
      icon: 'auto_awesome',
      colorClass: 'bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800',
      tagColorClass: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200',
      author: 'р. Ицхак Гинзбург',
    },
    {
      title: 'Шаббат',
      route: '/practices/runner/shabbat-yichud',
      icon: 'auto_awesome',
      colorClass: 'bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800',
      tagColorClass: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200',
      author: 'р. Ицхак Гинзбург',
    },
    {
      title: 'Четырехбуквенное имя',
      route: '/practices/runner/tetragrammaton-yichud',
      icon: 'auto_awesome',
      colorClass: 'bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800',
      tagColorClass: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200',
      author: 'р. Ицхак Гинзбург',
    },
  ];

  constructor(private router: Router) {}

  onPracticeSelected(practice: PracticeCard) {
    this.router.navigate([practice.route]);
  }
}
