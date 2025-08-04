import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal, GoalService } from '@app/core/services/goal.service';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-goal-detail',
  templateUrl: './goal-detail.component.html',
  styleUrls: ['./goal-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, PageHeaderComponent]
})
export class GoalDetailComponent implements OnInit {
  goal: Goal | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private goalService: GoalService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const goalId = params.get('id');
      if (goalId) {
        this.goal = this.goalService.getGoalById(goalId);
      }
    });
  }

  editGoal(): void {
    if (this.goal) {
      this.router.navigate(['/goals', this.goal.id, 'edit']);
    }
  }

  addPractice(): void {
    if (this.goal) {
      this.router.navigate(['/goals', this.goal.id, 'add-practice']);
    }
  }

  deleteGoal(): void {
    if (this.goal && confirm('Вы уверены, что хотите удалить эту цель? Это действие нельзя отменить.')) {
      this.goalService.deleteGoal(this.goal.id);
      this.router.navigate(['/goals']);
    }
  }

  goBackToGoals(): void {
    this.router.navigate(['/goals']);
  }

  getDirectionInRussian(direction: string): string {
    const translations: { [key: string]: string } = {
      'receiving': 'Получение',
      'giving': 'Отдача',
      'spiritual': 'Духовное',
      'material': 'Материальное',
      'personal': 'Личное',
      'social': 'Социальное',
      'relationships': 'Отношения',
      'health': 'Здоровье',
      'money': 'Деньги',
      'career': 'Карьера'
    };
    return translations[direction.toLowerCase()] || direction;
  }

  getReversedPractices() {
    if (!this.goal || !this.goal.practices) {
      return [];
    }
    return [...this.goal.practices].reverse();
  }
}
