import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Goal, GoalService } from '@app/core/services/goal.service';
import { GoalCardComponent } from '@app/shared/components/goal-card/goal-card.component';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-goals-page',
  templateUrl: './goals-page.component.html',
  styleUrls: ['./goals-page.component.scss'],
  standalone: true,
  imports: [CommonModule, GoalCardComponent, PageHeaderComponent],
})
export class GoalsPageComponent implements OnInit {
  goals: Goal[] = [];

  constructor(
    private goalService: GoalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.goals = this.goalService.getAllGoals().sort((a, b) => {
      // Main goal first
      if (a.isMainGoal && !b.isMainGoal) return -1;
      if (!a.isMainGoal && b.isMainGoal) return 1;
      return 0;
    });
  }

  onGoalSelected(goal: Goal): void {
    this.router.navigate(['/goals', goal.id]);
  }

  addNewGoal(): void {
    this.router.navigate(['/goals/new']);
  }

  goBackToHome(): void {
    this.router.navigate(['/']);
  }
}
