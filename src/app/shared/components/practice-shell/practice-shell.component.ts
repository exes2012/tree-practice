import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  PracticeStep,
  PracticeConfig,
  PracticeNavigation,
} from '../../interfaces/practice.interface';

@Component({
  selector: 'app-practice-shell',
  templateUrl: './practice-shell.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PracticeShellComponent {
  // Configuration
  @Input() config!: PracticeConfig;
  @Input() currentStep!: PracticeStep;
  @Input() currentStepIndex: number = 0;
  @Input() totalSteps: number = 0;
  @Input() navigation!: PracticeNavigation;

  // State
  @Input() isVoiceEnabled: boolean = true;
  @Input() isRepetitionActive: boolean = false;
  @Input() userRating: number = 5;

  // Data
  @Input() inputData: any = {};
  @Input() processedInstruction: string = '';

  // Events
  @Output() homeClicked = new EventEmitter<void>();
  @Output() voiceToggled = new EventEmitter<boolean>();
  @Output() nextClicked = new EventEmitter<void>();
  @Output() previousClicked = new EventEmitter<void>();
  @Output() repetitionToggled = new EventEmitter<boolean>();
  @Output() practiceFinished = new EventEmitter<number>();
  @Output() ratingChanged = new EventEmitter<number>();
  @Output() inputChanged = new EventEmitter<{ field: string; value: any }>();

  // Content projection
  @ContentChild('stepContent') stepContent!: TemplateRef<any>;

  constructor(private router: Router) {}

  onHomeClick(): void {
    this.homeClicked.emit();
  }

  onVoiceToggle(): void {
    this.voiceToggled.emit(!this.isVoiceEnabled);
  }

  onNextClick(): void {
    this.nextClicked.emit();
  }

  onPreviousClick(): void {
    this.previousClicked.emit();
  }

  onRepetitionToggle(): void {
    // Просто переключаем состояние и эмитим новое значение
    const newState = !this.isRepetitionActive;
    this.repetitionToggled.emit(newState);
  }

  onFinishPractice(): void {
    this.practiceFinished.emit(this.userRating);
  }

  onRatingChange(event: any): void {
    this.userRating = parseInt(event.target.value);
    this.ratingChanged.emit(this.userRating);
  }

  getRatingIcon(): string {
    const icons = [
      'sentiment_very_dissatisfied', // 1 - очень плохо
      'sentiment_dissatisfied', // 2 - плохо
      'sentiment_dissatisfied', // 3 - плохо
      'sentiment_neutral', // 4 - нейтрально
      'sentiment_neutral', // 5 - нейтрально
      'sentiment_satisfied', // 6 - хорошо
      'sentiment_satisfied', // 7 - хорошо
      'sentiment_very_satisfied', // 8 - очень хорошо
      'sentiment_very_satisfied', // 9 - очень хорошо
      'sentiment_very_satisfied', // 10 - отлично
    ];
    return icons[this.userRating - 1] || 'sentiment_neutral';
  }

  getNavigationButtonText(): string {
    if (this.navigation.isFirstStep) {
      return 'Выход';
    }
    return 'Назад';
  }

  getActionButtonText(): string {
    if (this.navigation.isLastStep) {
      return 'Завершить';
    }
    return 'Далее';
  }

  // Input handling methods
  getInputValue(fieldName: string): any {
    return this.inputData[fieldName] || '';
  }

  getInputPlaceholder(fieldName: string): string {
    const placeholders: { [key: string]: string } = {
      practiceFormulation: 'Что вы хотите получить от этой практики?',
      rephrasedGoal: 'Переформулируйте цель в соответствии с волей Творца',
      installationFormulation: 'Если у меня будет [цель], то ...',
      finalInstallationFormulation: 'Опишите ваше новое понимание...',
      feelingLocation: 'Опишите ощущения в теле',
      participantsVision: 'Опишите участников',
      selfVision: 'Опишите себя и Творца',
    };
    return placeholders[fieldName] || 'Введите значение...';
  }

  onInputChange(fieldName: string, event: any): void {
    const value = event.target.value;
    this.inputChanged.emit({ field: fieldName, value: value });
  }
}
