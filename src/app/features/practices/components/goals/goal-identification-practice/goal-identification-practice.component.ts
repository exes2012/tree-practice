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
  selector: 'app-goal-identification-practice',
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
  styleUrls: ['./goal-identification-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PracticeShellComponent],
})
export class GoalIdentificationPracticeComponent extends PracticeBaseComponent implements OnInit {
  goal: Goal | undefined;
  goalId: string | null = null;
  practiceFormulation: string = '';
  imageAnalysis: string = '';
  reasonForConcern: string = '';
  questionsToHelp: string = '';
  installationFormulation: string = '';

  get inputData() {
    return {
      practiceFormulation: this.practiceFormulation,
      imageAnalysis: this.imageAnalysis,
      reasonForConcern: this.reasonForConcern,
      questionsToHelp: this.questionsToHelp,
      installationFormulation: this.installationFormulation,
    };
  }

  config: PracticeConfig = {
    title: 'Выявление установки',
    description: 'Практика выявления и проработки установок относительно цели',
  };

  steps: PracticeStep[] = [
    {
      title: 'Шаг 1: Определение цели',
      instruction: 'Чего вы хотите достичь',
      inputField: 'practiceFormulation',
      initialValue: '',
      buttonText: 'Далее',
    },
    {
      title: 'Шаг 2: Убираем сопротивление',
      instruction: 'Проговаривай: <br><br><strong>{{repeatablePhrase}}</strong>',
      repeatablePhrase:
        'Можно мне было не хотеть "{{goal.title}}". Мне так было можно и мне это было для чего-то нужно. Я сам не хотел(а) "{{goal.title}}". Можно мне было не хотеть. У меня была на то причина. У меня была причина не хотеть "{{goal.title}}". Мне так было можно.',
      buttonText: 'Далее',
      showToggleRepetition: true,
    },
    {
      title: 'Шаг 3: Смотрим образ',
      instruction:
        'У меня уже есть "{{goal.title}}". Что вы при этом видите? Не анализируйте образ, просто почувствуйте его, а затем опишите.',
      inputField: 'imageAnalysis',
      buttonText: 'Далее',
    },
    {
      title: 'Шаг 4: Находим причину',
      instruction: 'Что смущает в образе?',
      inputField: 'reasonForConcern',
      buttonText: 'Далее',
    },
    {
      title: 'Шаг 5: Вопросы чтобы вам помочь',
      instruction:
        'Вопросы чтобы вам помочь: Какие эмоции у меня вызывает то, что я вижу? Как то, что я вижу, связано с моим сознательным запросом?',
      inputField: 'questionsToHelp',
      buttonText: 'Далее',
    },
    {
      title: 'Шаг 6: Формируем установку',
      instruction:
        'Дополните формулу "Если у меня будет "{{goal.title}}", то..." - тем неприятным, что нашли в образе или ощущениях.',
      inputField: 'installationFormulation',
      buttonText: 'Далее',
    },
    {
      title: 'Шаг 7: Проработка установки',
      instruction: 'Проговаривай: <br><br><strong>{{repeatablePhrase}}</strong>',
      repeatablePhrase:
        'Можно мне было думать, что {{installationFormulation}}. Но только я так думал(а). Это была только моя установка, только моя. Мне можно было пользоваться этой установкой, но она была только моя.',
      buttonText: 'Закончить',
      showToggleRepetition: true,
    },
    {
      title: 'Шаг 8: Оценка',
      instruction: 'Оцените проработку от 1 до 10.',
      buttonText: 'Завершить',
      showRating: true,
    },
  ];

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
        this.steps[0].initialValue = this.goal.title;
        this.installationFormulation = `Если у меня будет "${this.goal.title}", то `;
      }
    }
  }

  onPracticeFinished(rating: number): void {
    if (this.goalId && this.goal) {
      const newPractice: GoalPractice = {
        id: uuidv4(),
        type: 'Выявление установки',
        formulation: this.practiceFormulation,
        date: new Date().toISOString().split('T')[0],
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

    // Replace installationFormulation placeholder
    if (this.installationFormulation) {
      instruction = instruction.replace(
        /\{\{installationFormulation\}\}/g,
        this.installationFormulation
      );
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

    // Replace installationFormulation placeholder
    if (this.installationFormulation) {
      phrase = phrase.replace(/\{\{installationFormulation\}\}/g, this.installationFormulation);
    }

    // Replace userInstallationInput placeholder
    const userInput = this.getUserInstallationInput();
    phrase = phrase.replace(/\{\{userInstallationInput\}\}/g, userInput);

    return phrase;
  }

  onInputChanged(event: { field: string; value: any }): void {
    switch (event.field) {
      case 'practiceFormulation':
        this.practiceFormulation = event.value;
        break;
      case 'imageAnalysis':
        this.imageAnalysis = event.value;
        break;
      case 'reasonForConcern':
        this.reasonForConcern = event.value;
        break;
      case 'questionsToHelp':
        this.questionsToHelp = event.value;
        break;
      case 'installationFormulation':
        this.installationFormulation = event.value;
        break;
    }
  }

  getUserInstallationInput(): string {
    if (!this.goal || !this.installationFormulation) {
      return '';
    }
    const prefix = `Если у меня будет "${this.goal.title}", то `;
    return this.installationFormulation.replace(prefix, '');
  }
}
