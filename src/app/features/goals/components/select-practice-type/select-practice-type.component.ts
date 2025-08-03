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
      title: 'Выявление установки',
      route: 'identification',
      icon: 'lightbulb',
      colorClass: 'bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800',
      author: 'Гмар Тиккун',
      tagColorClass: 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
    },
    {
      title: 'Подъем МАН с целью',
      route: 'man-with-goal',
      icon: 'trending_up',
      colorClass: 'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800',
      author: 'Гмар Тиккун',
      tagColorClass: 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
    },
    {
      title: 'Сонастройка цели с Творцом',
      route: 'alignment',
      icon: 'sync',
      colorClass: 'bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800',
      author: 'Гмар Тиккун',
      tagColorClass: 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200'
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
