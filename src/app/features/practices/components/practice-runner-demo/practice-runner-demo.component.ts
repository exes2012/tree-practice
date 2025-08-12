import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { PracticeRunnerComponent } from '../../../../shared/components/practice-runner/practice-runner.component';
import { PracticeConfig, PracticeResult } from '../../../../core/models/practice-engine.types';
import { specificRequestPracticeV2Config } from '../../../../core/practices/specific-request-practice-v2';
import { shekhinahFieldPracticeConfig } from '../../../../core/practices/shekhinah-field-practice';
import { specificRequestPracticeCopyConfig } from '../../../../core/practices/specific-request-practice-copy';
import { healthWorkPracticeConfig } from '../../../../core/practices/health-work-practice';
import { habitsWorkPracticeConfig } from '../../../../core/practices/habits-work-practice';
import { shadowIntegrationPracticeConfig } from '../../../../core/practices/shadow-integration-practice';
import { goalAlignmentPracticeConfig } from '../../../../core/practices/goal-alignment-practice';
import { goalIdentificationPracticeConfig } from '../../../../core/practices/goal-identification-practice';
import { goalManPracticeConfig } from '../../../../core/practices/goal-man-practice';
import { reflectedLightPracticeConfig } from '../../../../core/practices/reflected-light-practice';
import { GoalService } from '../../../../core/services/goal.service';

@Component({
  selector: 'app-practice-runner-demo',
  template: `
    <app-practice-runner 
      *ngIf="practiceConfig"
      [config]="practiceConfig"
      [initialContext]="initialContext"
      (practiceFinished)="onPracticeFinished($event)"
      (practiceStarted)="onPracticeStarted()">
    </app-practice-runner>
    
    <div *ngIf="!practiceConfig" class="container mx-auto px-4 pt-8 text-center">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p class="text-gray-700 dark:text-gray-300">Практика не найдена</p>
        <button (click)="goHome()" class="mt-4 px-4 py-2 bg-primary-500 text-white rounded">
          На главную
        </button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, PracticeRunnerComponent]
})
export class PracticeRunnerDemoComponent implements OnInit {
  practiceConfig: PracticeConfig | null = null;
  initialContext: any = {};
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private goalService: GoalService
  ) {}
  
  ngOnInit(): void {
    this.setupPractice();
  }
  
  private setupPractice(): void {
    const practiceId = this.route.snapshot.params['practiceId'];
    const goalId = this.route.snapshot.params['goalId'];
    
    // Загружаем цель, если нужна
    if (goalId) {
      const goal = this.goalService.getGoalById(goalId);
      this.initialContext = { goalId, goal };
    }
    
    // Выбираем конфигурацию практики
    switch (practiceId) {
      case 'specific-request':
      case 'specific-request-v2': // Поддерживаем старый ID для совместимости
        this.practiceConfig = specificRequestPracticeV2Config;
        break;

      case 'shekhinah-field':
        this.practiceConfig = shekhinahFieldPracticeConfig;
        break;

      case 'specific-request-copy':
        this.practiceConfig = specificRequestPracticeCopyConfig;
        break;

      case 'health-work':
        this.practiceConfig = healthWorkPracticeConfig;
        break;

      case 'habits-work':
        this.practiceConfig = habitsWorkPracticeConfig;
        break;

      case 'shadow-integration':
        this.practiceConfig = shadowIntegrationPracticeConfig;
        break;

      case 'goal-alignment':
        this.practiceConfig = goalAlignmentPracticeConfig;
        break;

      case 'goal-identification':
        this.practiceConfig = goalIdentificationPracticeConfig;
        break;

      case 'goal-man':
        this.practiceConfig = goalManPracticeConfig;
        break;

      case 'reflected-light':
        this.practiceConfig = reflectedLightPracticeConfig;
        break;
        
      default:
        console.error('Unknown practice:', practiceId);
        break;
    }
  }
  
  onPracticeStarted(): void {
    console.log('Practice started');
  }
  
  onPracticeFinished(result: PracticeResult): void {
    console.log('Practice finished with result:', result);
    
    // Навигация после завершения
    const goalId = this.route.snapshot.params['goalId'];
    if (goalId) {
      this.router.navigate(['/goals', goalId]);
    } else {
      this.router.navigate(['/practices']);
    }
  }
  
  goHome(): void {
    this.router.navigate(['/']);
  }
}