import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SpeechService } from '../../services/speech.service';
import { PracticeStep, PracticeConfig, PracticeNavigation, PracticeResult } from '../../interfaces/practice.interface';

@Component({
  template: '', // Abstract component
  standalone: true
})
export abstract class PracticeBaseComponent implements OnInit, OnDestroy {
  // State
  currentStepIndex: number = 0;
  isVoiceEnabled: boolean = true;
  isRepetitionActive: boolean = false;
  userRating: number = 5;

  // Abstract properties - must be implemented by child classes
  abstract steps: PracticeStep[];
  abstract config: PracticeConfig;

  constructor(
    protected router: Router,
    protected speechService: SpeechService
  ) {}

  ngOnInit(): void {
    this.initializePractice();
    // Озвучиваем первый шаг
    this.speakCurrentStep();
  }

  ngOnDestroy(): void {
    this.speechService.clearRepetition();
  }

  // Abstract methods - must be implemented by child classes
  abstract initializePractice(): void;
  abstract onPracticeFinished(rating: number): void;
  abstract getProcessedInstruction(step: PracticeStep): string;
  abstract getProcessedRepeatablePhrase(step: PracticeStep): string;

  // Common navigation logic
  get currentStep(): PracticeStep {
    return this.steps[this.currentStepIndex];
  }

  get navigation(): PracticeNavigation {
    return {
      canGoNext: this.currentStepIndex < this.steps.length - 1,
      canGoPrevious: this.currentStepIndex > 0,
      isLastStep: this.currentStepIndex === this.steps.length - 1,
      isFirstStep: this.currentStepIndex === 0
    };
  }

  // Navigation methods
  onHomeClick(): void {
    this.speechService.clearRepetition();
    this.router.navigate(['/']);
  }

  onVoiceToggle(enabled: boolean): void {
    this.isVoiceEnabled = enabled;
    if (!enabled) {
      this.speechService.clearRepetition();
      this.isRepetitionActive = false;
    }
  }

  onNextClick(): void {
    // ПРИНУДИТЕЛЬНО очищаем повтор при переходе
    this.speechService.clearRepetition();
    this.isRepetitionActive = false;

    if (this.navigation.canGoNext) {
      this.currentStepIndex++;
      this.speakCurrentStep();
    }
  }

  onPreviousClick(): void {
    // ПРИНУДИТЕЛЬНО очищаем повтор при переходе
    this.speechService.clearRepetition();
    this.isRepetitionActive = false;

    if (this.navigation.canGoPrevious) {
      this.currentStepIndex--;
      this.speakCurrentStep();
    }
  }

  onRepetitionToggle(active: boolean): void {
    this.isRepetitionActive = active;
    
    if (this.isRepetitionActive && this.currentStep?.repeatablePhrase && this.isVoiceEnabled) {
      const phrase = this.getProcessedRepeatablePhrase(this.currentStep);
      this.speechService.startRepetition(phrase);
    } else {
      this.speechService.clearRepetition();
    }
  }

  onRatingChange(rating: number): void {
    this.userRating = rating;
  }

  // Speech methods
  protected speakCurrentStep(): void {
    if (this.isVoiceEnabled) {
      const instruction = this.getProcessedInstruction(this.currentStep);
      this.speechService.speak(instruction);
    }
  }

  protected speak(text: string): void {
    if (this.isVoiceEnabled) {
      this.speechService.speak(text);
    }
  }
}
