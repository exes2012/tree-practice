import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { PracticeService } from '../../../../core/services/practice.service';

interface PracticeStep {
  title: string;
  instruction: string;
}

@Component({
  selector: 'app-zeir-anpin-space-practice',
  templateUrl: './zeir-anpin-space-practice.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ZeirAnpinSpacePracticeComponent implements OnDestroy {
  isPracticeStarted = false;
  currentStepIndex = 0;
  userRating = 5;
  isVoiceEnabled = true;
  
  stepDurationOptions = [10, 15, 30, 60];
  practiceDurationOptions = [1, 2, 5, 10, 15, 20, 30, 60];
  mainPracticeStepIndex = 9; // The step where the main practice begins

  stepTimer: number = 30;
  practiceTimer: number = 0;
  selectedStepDuration: number = 30;
  selectedPracticeDuration: number = 1;

  stepInterval: any;
  practiceInterval: any;
  audio = new Audio('/assets/sound/bell.mp3');

  practiceSteps: PracticeStep[] = [
    { title: 'Шаг 1: Пространство', instruction: 'Почувствуй пространство, себя и свое тело.' },
    { title: 'Шаг 2: Сфира Нецах', instruction: 'Отметь пространство сверху. Это сфира Нэцах. Вера в существование Бога. Удерживай это состояние' },
    { title: 'Шаг 3: Сфира Ход', instruction: 'Отметь пространство снизу. Это сфира Ход. Отказ от идолопоклонства. Удерживай это состояние' },
    { title: 'Шаг 4: Сфира Есод', instruction: 'Отметь пространство позади себя. Это сфира Есод. Охрана разума от нечистых мыслей. Удерживай это состояние' },
    { title: 'Шаг 5: Сфира Хесед', instruction: 'Отметь пространство справа от себя. Это сфира Хесэд. Любовь к Богу. Удерживай это состояние' },
    { title: 'Шаг 6: Сфира Гвура', instruction: 'Отметь пространство слева от себя. Это сфира Гвура. Трепет перед Творцом. Удерживай это состояние' },
    { title: 'Шаг 7: Сфира Тиферет', instruction: 'Отметь пространство перед тобой. Это сфира Тифэрэт. Вера в единство Бога. Удерживай это состояние' },
    { title: 'Шаг 8: Куб', instruction: 'Отметь все пространства одновременно, и себя как Малхут внутри них, формируя куб. Удерживай это состояние' },
    { title: 'Шаг 9: Найти Творца', instruction: 'Найди в этом пространстве Творца' },
    { title: 'Шаг 10: Единение', instruction: 'Оставайся с Творцом в пространстве Зэир Анпина. Сокращай все мысли, отрывающие тебя от единства с Ним.' },
    { title: 'Шаг 11: Оценка', instruction: 'Оцени, насколько хорошо у тебя получилось выполнить упражнение.' }
  ];

  constructor(private location: Location, private practiceService: PracticeService) {}

  ngOnDestroy() {
    this.clearAllTimers();
    window.speechSynthesis.cancel();
  }

  goBack() {
    this.clearAllTimers();
    window.speechSynthesis.cancel();
    this.location.back();
  }

  toggleVoice() {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    if (!this.isVoiceEnabled) {
      window.speechSynthesis.cancel();
    }
  }

  speak(text: string) {
    if (!this.isVoiceEnabled) return;
    window.speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, ''));
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  getMinuteWord(minutes: number): string {
    const lastDigit = minutes % 10;
    const lastTwoDigits = minutes % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'минут';
    }
    if (lastDigit === 1) {
      return 'минуты';
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'минут';
    }
    return 'минут';
  }

  getInstruction(): string {
    const step = this.practiceSteps[this.currentStepIndex];
    let instruction = step.instruction;
    if (this.currentStepIndex >= 1 && this.currentStepIndex <= 7) {
      instruction += ` на протяжении ${this.selectedStepDuration} секунд.`;
    }
    if (this.currentStepIndex === 9) {
      const minuteWord = this.getMinuteWord(this.selectedPracticeDuration);
      instruction += ` на протяжении ${this.selectedPracticeDuration} ${minuteWord}.`;
    }
    return instruction;
  }

  startPractice() {
    this.isPracticeStarted = true;
    this.currentStepIndex = 0;
    this.startStepTimer();
    this.speak(this.getInstruction());
  }

  setStepDuration(seconds: number) {
    this.selectedStepDuration = seconds;
  }

  setPracticeDuration(minutes: number) {
    this.selectedPracticeDuration = minutes;
  }

  startStepTimer() {
    this.stepTimer = this.selectedStepDuration;
    this.stepInterval = setInterval(() => {
      this.stepTimer--;
      if (this.stepTimer < 0) {
        this.nextStep();
      }
    }, 1000);
  }

  startPracticeTimer() {
    this.practiceTimer = this.selectedPracticeDuration * 60;
    this.practiceInterval = setInterval(() => {
      this.practiceTimer--;
      if (this.practiceTimer < 0) {
        this.finishPractice();
      }
    }, 1000);
  }

  nextStep() {
    this.clearAllTimers();
    if (this.currentStepIndex < this.practiceSteps.length - 1) {
      this.currentStepIndex++;
      if (this.currentStepIndex < this.practiceSteps.length - 1) {
        this.speak(this.getInstruction());
      }
      if (this.currentStepIndex < this.mainPracticeStepIndex) {
        this.startStepTimer();
      } else if (this.currentStepIndex === this.mainPracticeStepIndex) {
        this.startPracticeTimer();
      }
    }
  }

  previousStep() {
    this.clearAllTimers();
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.speak(this.getInstruction());
      if (this.currentStepIndex < this.mainPracticeStepIndex) {
        this.startStepTimer();
      } else if (this.currentStepIndex === this.mainPracticeStepIndex) {
        this.startPracticeTimer();
      }
    }
  }

  finishPractice() {
    this.clearAllTimers();
    this.audio.play();
    this.currentStepIndex = this.practiceSteps.length - 1; // Move to rating step
    window.speechSynthesis.cancel();
  }

  exitPractice() {
    this.practiceService.saveLastPractice({ name: 'Малое состояние - Пространство Зеир Анпина', route: '/practices/small-state/zeir-anpin-space' });
    this.practiceService.recordPracticeCompletion();
    this.goBack();
  }

  getRatingFace(): string {
    if (this.userRating == 10) return '🤩';
    if (this.userRating >= 9) return '😁';
    if (this.userRating >= 8) return '😄';
    if (this.userRating >= 7) return '😊';
    if (this.userRating >= 6) return '🙂';
    if (this.userRating >= 5) return '😐';
    if (this.userRating >= 4) return '😕';
    if (this.userRating >= 3) return '😟';
    if (this.userRating >= 2) return '😢';
    return '😭';
  }

  clearAllTimers() {
    clearInterval(this.stepInterval);
    clearInterval(this.practiceInterval);
  }
}
