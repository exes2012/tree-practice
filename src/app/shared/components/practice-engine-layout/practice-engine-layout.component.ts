import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Practice, PracticeStep } from '@app/core/models/practice.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-practice-engine-layout',
  templateUrl: './practice-engine-layout.component.html',
  styleUrls: ['./practice-engine-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PracticeEngineLayoutComponent implements OnChanges {
  @Input() practice: Practice | null = null;
  @Input() currentStep: PracticeStep | null = null;
  @Input() currentStepIndex: number = -1;
  @Input() isPracticeStarted: boolean = false;

  @Output() startPractice = new EventEmitter<void>();
  @Output() nextStep = new EventEmitter<any>();
  @Output() previousStep = new EventEmitter<void>();
  @Output() finishPractice = new EventEmitter<number>();

  userRating: number = 5;
  isRepetitionActive = false;
  private repetitionInterval: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentStep'] && changes['currentStep'].currentValue) {
      // Останавливаем предыдущее повторение и звук
      this.clearRepetition();
      this.isRepetitionActive = false;

      // Воспроизводим инструкцию нового шага
      this.speak(changes['currentStep'].currentValue.instruction);
    }
  }

  onNextStep(): void {
    if (this.currentStep?.type === 'rating') {
      this.finishPractice.emit(this.userRating);
    } else {
      // Здесь можно будет передавать данные из полей ввода
      this.nextStep.emit();
    }
  }

  toggleRepetition(): void {
    this.isRepetitionActive = !this.isRepetitionActive;
    if (this.isRepetitionActive) {
      this.startRepetition();
    } else {
      this.clearRepetition();
    }
  }

  private startRepetition(): void {
    this.clearRepetition();
    const phrase = this.currentStep?.repeatablePhrase || this.currentStep?.instruction;
    if (phrase) {
      this.speak(phrase, true);
      this.repetitionInterval = setInterval(() => {
        if (this.isRepetitionActive) {
          this.speak(phrase, true);
        }
      }, 15000);
    }
  }

  private clearRepetition(): void {
    if (this.repetitionInterval) {
      clearInterval(this.repetitionInterval);
      this.repetitionInterval = null;
    }
    window.speechSynthesis.cancel();
  }

  private speak(text: string, isRepetition: boolean = false): void {
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

  // Просто для отображения кнопки "Завершить" на последнем шаге
  isLastStep(): boolean {
    if (!this.practice) return false;
    return this.currentStepIndex === this.practice.steps.length - 1;
  }
}
