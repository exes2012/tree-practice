import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GoalService } from '@app/core/services/goal.service';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';
import { PracticeCard, PracticeListComponent } from '@app/shared/components/practice-list/practice-list.component';
import { PracticePageLayoutComponent } from '@app/shared/components/practice-page-layout/practice-page-layout.component';

@Component({
  selector: 'app-select-practice-type',
  templateUrl: './select-practice-type.component.html',
  styleUrls: ['./select-practice-type.component.scss'],
  standalone: true,
  imports: [CommonModule, PracticePageLayoutComponent, PracticeListComponent]
})
export class SelectPracticeTypeComponent implements OnInit {
  goalId: string | null = null;
  practiceTypes: PracticeCard[] = [

    {
      title: 'Подъем МАН с целью',
      route: 'man-with-goal',
      icon: 'rocket_launch',
      colorClass: 'bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 dark:hover:bg-orange-800',
      author: 'Гмар Тиккун',
      tagColorClass: 'bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200'
    },
    {
      title: 'Сонастройка цели с Творцом',
      route: 'alignment',
      icon: 'tune',
      colorClass: 'bg-teal-100 dark:bg-teal-900 hover:bg-teal-200 dark:hover:bg-teal-800',
      author: 'Гмар Тиккун',
      tagColorClass: 'bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200'
    },
    {
      title: 'Выявление установки',
      route: 'identification',
      icon: 'psychology',
      colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800',
      author: 'Гмар Тиккун',
      tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200'
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private goalService: GoalService
  ) { }

  ngOnInit(): void {
    this.goalId = this.route.snapshot.paramMap.get('id');
  }

  onPracticeSelected(practice: PracticeCard): void {
    if (this.goalId) {
      this.router.navigate(['/goals', this.goalId, 'practice', practice.route]);
    }
  }
}
