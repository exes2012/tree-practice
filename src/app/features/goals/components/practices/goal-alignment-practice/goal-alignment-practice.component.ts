import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PracticeBaseComponent } from '../../../../../shared/components/practice-base/practice-base.component';
import { PracticeShellComponent } from '../../../../../shared/components/practice-shell/practice-shell.component';
import { SpeechService } from '../../../../../shared/services/speech.service';
import { PracticeStep, PracticeConfig } from '../../../../../shared/interfaces/practice.interface';
import { Goal, GoalService, GoalPractice } from '@app/core/services/goal.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-goal-alignment-practice',
  template: `
    <app-practice-shell
      [config]="config"
      [currentStep]="currentStep"
      [currentStepIndex]="currentStepIndex"
      [totalSteps]="steps.length"
      [navigation]="navigation"
      [isVoiceEnabled]="isVoiceEnabled"
      [isRepetitionActive]="isRepetitionActive"
      [userRating]="userRating"
      [inputData]="inputData"
      [processedInstruction]="getProcessedInstruction(currentStep)"
      (homeClicked)="onHomeClick()"
      (voiceToggled)="onVoiceToggle($event)"
      (nextClicked)="onNextClick()"
      (previousClicked)="onPreviousClick()"
      (repetitionToggled)="onRepetitionToggle($event)"
      (practiceFinished)="onPracticeFinished($event)"
      (ratingChanged)="onRatingChange($event)"
      (inputChanged)="onInputChanged($event)"
    ></app-practice-shell>
  `,
  styleUrls: ['./goal-alignment-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PracticeShellComponent]
})
export class GoalAlignmentPracticeComponent extends PracticeBaseComponent implements OnInit {
  goal: Goal | undefined;
  goalId: string | null = null;
  practiceFormulation: string = '';
  visionAfterAchievingGoal: string = '';
  alignmentRating: number = 5;
  rephrasedGoal: string = '';
  shouldUpdateGoal: boolean = false;

  get inputData() {
    return {
      practiceFormulation: this.practiceFormulation,
      visionAfterAchievingGoal: this.visionAfterAchievingGoal,
      alignmentRating: this.alignmentRating,
      rephrasedGoal: this.rephrasedGoal,
      shouldUpdateGoal: this.shouldUpdateGoal
    };
  }

  config: PracticeConfig = {
    title: 'Сонастройка цели с Творцом',
    description: 'Практика сонастройки цели с волей Творца'
  };

  baseSteps: PracticeStep[] = [
    {
      title: 'Шаг 1: Ощущение',
      instruction: 'Почувствуй пространство, себя, свое тело.',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 2: Определение цели',
      instruction: 'Какую цель ты бы хотел проработать?',
      inputField: 'practiceFormulation',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 3: Видение достигнутой цели',
      instruction: 'Представьте, что цель "{{goal.title}}" уже достигнута, что вы при этом видите?',
      inputField: 'visionAfterAchievingGoal',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 4: Настройка на отдачу',
      instruction: 'Настройтесь на наслаждение от свойства отдачи. Выполните поочередно стадии Кетер, Хохма и Бина. Найдите за наслаждением от свойства отдачи Творца и его отношение к Вам.',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 5: Сравнение ощущений',
      instruction: 'Сравните ваше ощущение от уже достигнутой цели с ощущением благодарности и желания насладить Творца.',
      inputField: 'alignmentRating',
      inputType: 'number',
      buttonText: 'Далее'
    }
  ];

  steps: PracticeStep[] = [];

  constructor(
    router: Router,
    speechService: SpeechService,
    private route: ActivatedRoute,
    private goalService: GoalService
  ) {
    super(router, speechService);
  }

  initializePractice(): void {
    this.goalId = this.route.snapshot.paramMap.get('id');
    if (this.goalId) {
      this.goal = this.goalService.getGoalById(this.goalId);
      if (this.goal) {
        this.practiceFormulation = this.goal.title;
        this.rephrasedGoal = this.goal.title;
      }
    }
    // Initialize steps with base steps only
    this.steps = [...this.baseSteps];
  }

  onPracticeFinished(rating: number): void {
    if (this.goalId && this.goal) {
      // Update goal title if user chose to
      if (this.shouldUpdateGoal && this.rephrasedGoal) {
        this.goal.title = this.rephrasedGoal;
        this.goalService.updateGoal(this.goal);
      }

      const newPractice: GoalPractice = {
        id: uuidv4(),
        type: 'Сонастройка цели с Творцом',
        formulation: this.rephrasedGoal || this.practiceFormulation,
        date: new Date().toISOString().split('T')[0]
      };
      this.goalService.addPracticeToGoal(this.goalId, newPractice);
      this.router.navigate(['/goals', this.goalId]);
    }
  }

  getProcessedInstruction(step: PracticeStep): string {
    let instruction = step.instruction;

    // Replace goal.title placeholder
    if (this.goal) {
      instruction = instruction.replace(/\{\{goal\.title\}\}/g, this.goal.title);
    }

    // Replace repeatablePhrase placeholder
    if (step.repeatablePhrase) {
      let repeatablePhrase = this.getProcessedRepeatablePhrase(step);
      instruction = instruction.replace(/\{\{repeatablePhrase\}\}/g, repeatablePhrase);
    }

    return instruction;
  }

  getProcessedRepeatablePhrase(step: PracticeStep): string {
    let phrase = step.repeatablePhrase || '';
    
    // Replace goal.title placeholder
    if (this.goal) {
      phrase = phrase.replace(/\{\{goal\.title\}\}/g, this.goal.title);
    }
    
    return phrase;
  }

  onInputChanged(event: {field: string, value: any}): void {
    switch(event.field) {
      case 'practiceFormulation':
        this.practiceFormulation = event.value;
        break;
      case 'visionAfterAchievingGoal':
        this.visionAfterAchievingGoal = event.value;
        break;
      case 'alignmentRating':
        this.alignmentRating = parseInt(event.value);
        break;
      case 'rephrasedGoal':
        this.rephrasedGoal = event.value;
        break;
      case 'shouldUpdateGoal':
        this.shouldUpdateGoal = event.value === 'true' || event.value === true;
        break;
    }
  }

  // Override navigation to handle cycles
  override onNextClick(): void {
    const currentStep = this.steps[this.currentStepIndex];

    // Check if we're on the alignment rating step (step 5)
    if (currentStep?.inputField === 'alignmentRating') {
      if (this.alignmentRating === 10) {
        // Perfect alignment - ask if user wants to update goal
        this.addGoalUpdateStep();
        this.currentStepIndex++;
      } else {
        // Not perfect - add refinement cycle
        this.addRefinementCycle();
        this.currentStepIndex++;
      }
    }
    // Check if we're on the vision step after refinement
    else if (currentStep?.title === 'Шаг 7: Новое видение') {
      // Go back to step 5 for re-evaluation
      this.goBackToRating();
    }
    // Check if we're on goal update step
    else if (currentStep?.inputField === 'shouldUpdateGoal') {
      // Add final rating step
      this.addFinalRatingStep();
      this.currentStepIndex++;
    }
    // Check if we're on final rating step
    else if (currentStep?.showRating && currentStep?.title?.includes('Оценка')) {
      // Finish practice
      this.onPracticeFinished(this.userRating);
    }
    // Normal step progression
    else {
      super.onNextClick();
    }
  }

  private addRefinementCycle(): void {
    // Add refinement steps
    this.steps.push({
      title: 'Шаг 6: Переформулировка цели',
      instruction: 'Как бы вы могли переформулировать цель, чтобы Творец притягивал от вас на 10 из 10?',
      inputField: 'rephrasedGoal',
      buttonText: 'Далее'
    });

    this.steps.push({
      title: 'Шаг 7: Новое видение',
      instruction: 'Представьте, что цель в ее новой формулировке уже достигнута, что вы при этом видите?',
      inputField: 'visionAfterAchievingGoal',
      buttonText: 'Далее'
    });
  }

  private addGoalUpdateStep(): void {
    this.steps.push({
      title: 'Обновление цели',
      instruction: 'Желаете ли вы перезаписать первоначальную формулировку цели на текущую сформулированную?',
      inputField: 'shouldUpdateGoal',
      inputType: 'radio',
      options: [
        { value: 'true', label: 'Да, обновить цель' },
        { value: 'false', label: 'Нет, оставить как есть' }
      ],
      buttonText: 'Далее'
    });
  }

  private addFinalRatingStep(): void {
    this.steps.push({
      title: 'Оценка проработки',
      instruction: 'Оцените проработку от 1 до 10.',
      buttonText: 'Завершить',
      showRating: true
    });
  }

  private goBackToRating(): void {
    // Remove all steps after step 5 and go back to rating
    this.steps = this.steps.slice(0, 5);
    this.currentStepIndex = 4; // Step 5 (index 4)
  }
}
