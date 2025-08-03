import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal, GoalService, GoalPractice } from '@app/core/services/goal.service';
import { PracticeLayoutComponent } from '@app/shared/components/practice-layout/practice-layout.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-alignment-practice',
  templateUrl: './alignment-practice.component.html',
  styleUrls: ['./alignment-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PracticeLayoutComponent]
})
export class AlignmentPracticeComponent implements OnInit {
  goal: Goal | undefined;
  goalId: string | null = null;
  practiceFormulation: string = '';
  visionAfterAchievingGoal: string = '';
  alignmentRating: number = 0;
  rephrasedGoal: string = '';
  finalRating: number = 5; // For final practice rating

  currentStepIndex: number = 0;
  isRepetitionActive: boolean = false;
  hasReachedPerfectAlignment: boolean = false;

  baseSteps = [
    {
      title: 'Шаг 1: Ощущение',
      instruction: 'Почувствуй пространство, себя, свое тело.',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 2: Определение цели',
      instruction: 'Какую цель ты бы хотел проработать?',
      inputField: 'practiceFormulation',
      initialValue: '',
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
      buttonText: 'Далее'
    }
  ];

  steps: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private goalService: GoalService
  ) { }

  ngOnInit(): void {
    this.goalId = this.route.snapshot.paramMap.get('id');
    if (this.goalId) {
      this.goal = this.goalService.getGoalById(this.goalId);
      if (this.goal) {
        this.practiceFormulation = this.goal.title;
      }
    }
    // Initialize steps - add extra steps so step 5 is not the last
    this.steps = [...this.baseSteps];
    // Add dummy steps to prevent "last step" detection on step 5
    this.steps.push({ title: 'Dummy 1', instruction: '', buttonText: 'Далее' });
    this.steps.push({ title: 'Dummy 2', instruction: '', buttonText: 'Далее' });
  }

  onPracticeFinishedFromLayout(event: { rating: number }): void {
    console.log('Practice finished from layout with rating:', event.rating);
    // Save the final rating
    this.finalRating = event.rating;
    // Call the original finish method
    this.onPracticeFinished();
  }

  onPracticeFinished(): void {
    if (this.goalId && this.goal) {
      const newPractice: GoalPractice = {
        id: uuidv4(),
        type: 'Сонастройка цели с Творцом',
        formulation: this.rephrasedGoal || this.practiceFormulation,
        date: new Date().toISOString().split('T')[0]
      };
      this.goalService.addPracticeToGoal(this.goalId, newPractice);

      // Update goal title if it was rephrased
      if (this.rephrasedGoal && this.rephrasedGoal.trim() !== '') {
        this.goal.title = this.rephrasedGoal;
        this.goalService.updateGoal(this.goal);
      }

      this.router.navigate(['/goals', this.goalId]);
    }
  }

  private isCongratulationsStep(): boolean {
    const currentStep = this.steps[this.currentStepIndex];
    return currentStep && currentStep.title === 'Поздравляем!';
  }

  private isFinalRatingStep(): boolean {
    const currentStep = this.steps[this.currentStepIndex];
    return currentStep && currentStep.isFinalRating === true;
  }

  private isStep7(): boolean {
    const currentStep = this.steps[this.currentStepIndex];
    return currentStep && currentStep.title === 'Шаг 7: Проверка';
  }

  onNextStepClicked(): void {
    // Check if we're on the initial rating step (step 5, index 4)
    if (this.currentStepIndex === 4) {
      if (this.alignmentRating === 10) {
        // Perfect alignment achieved - remove dummy steps and add congratulations
        this.hasReachedPerfectAlignment = true;
        this.steps = this.steps.slice(0, 5); // Keep only first 5 steps
        this.addCongratulationsStep();
        this.currentStepIndex++;
      } else {
        // Not perfect - remove dummy steps and add refinement cycle
        this.steps = this.steps.slice(0, 5); // Keep only first 5 steps
        this.addRefinementCycle();
        this.currentStepIndex++;
      }
    }
    // Check if we're on step 7 (vision of new formulation)
    else if (this.isStep7()) {
      // Remove dummy steps and go back to step 5 for re-evaluation
      this.steps = this.steps.filter(step => !step.title.startsWith('Dummy'));
      this.currentStepIndex = 4; // Go back to step 5 (index 4)
    }
    // Check if we're on congratulations step
    else if (this.isCongratulationsStep()) {
      // Remove dummy steps and add final rating
      this.steps = this.steps.filter(step => !step.title.startsWith('Dummy'));
      this.addFinalRatingStep();
      this.currentStepIndex++;
    }
    // Check if we're on final rating step
    else if (this.isFinalRatingStep()) {
      // Finish practice
      this.onPracticeFinished();
    }
    // Normal step progression
    else {
      this.currentStepIndex++;
    }
  }

  onPreviousStepClicked(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  private addCongratulationsStep(): void {
    this.steps.push({
      title: 'Поздравляем!',
      instruction: 'Поздравляем, Ваша цель синхронизирована с Творцом!',
      buttonText: 'Далее'
    });

    // Add dummy steps so congratulations is not the last
    this.steps.push({ title: 'Dummy 5', instruction: '', buttonText: 'Далее' });
    this.steps.push({ title: 'Dummy 6', instruction: '', buttonText: 'Далее' });
  }

  private addRefinementCycle(): void {
    const cycleNumber = this.getRefinementCycleNumber();

    this.steps.push({
      title: `Шаг 6: Переформулировка цели`,
      instruction: 'Как бы вы могли переформулировать цель, чтобы Творец притягивал от вас на 10 из 10?',
      inputField: 'rephrasedGoal',
      buttonText: 'Далее'
    });

    this.steps.push({
      title: `Шаг 7: Проверка`,
      instruction: 'Представьте, что цель в ее новой формулировке уже достигнута, что вы при этом видите?',
      inputField: 'visionAfterAchievingGoal',
      buttonText: 'Далее'
    });

    // Add dummy steps so step 7 is not the last
    this.steps.push({ title: 'Dummy 3', instruction: '', buttonText: 'Далее' });
    this.steps.push({ title: 'Dummy 4', instruction: '', buttonText: 'Далее' });
  }

  private addFinalRatingStep(): void {
    this.steps.push({
      title: 'Оценка проработки',
      instruction: 'Оцените проработку от 1 до 10.',
      buttonText: 'Завершить',
      showRating: true,
      isFinalRating: true
    });
  }





  private getRefinementCycleNumber(): number {
    return this.steps.filter(step => step.inputField === 'rephrasedGoal').length + 1;
  }



  onToggleRepetitionClicked(isActive: boolean): void {
    this.isRepetitionActive = isActive;
    const currentStep = this.steps[this.currentStepIndex];
    if (this.isRepetitionActive && (currentStep as any)?.repeatablePhrase) {
      this.speak(this.getRepeatablePhrase(currentStep), true);
    } else {
      window.speechSynthesis.cancel();
    }
  }

  private speak(text: string, isRepetition: boolean = false) {
    if (!text) return;
    if (!isRepetition) {
        window.speechSynthesis.cancel();
    }
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  getInstruction(step: any): string {
    let instruction = step.instruction;
    if (this.goal) {
      // For step 7, use the rephrased goal if available
      if (step.title === 'Шаг 7: Видение новой формулировки') {
        const goalTitle = this.rephrasedGoal && this.rephrasedGoal.trim() !== '' ? this.rephrasedGoal : this.goal.title;
        instruction = instruction.replace(/\{\{goal.title\}\}/g, goalTitle);
      } else {
        // For other steps, use original goal title
        instruction = instruction.replace(/\{\{goal.title\}\}/g, this.goal.title);
      }
    }
    return instruction;
  }

  getRepeatablePhrase(step: any): string {
    let phrase = step.repeatablePhrase;
    if (this.goal) {
      phrase = phrase.replace(/\{\{goal.title\}\}/g, this.goal.title);
    }
    return phrase;
  }
}

