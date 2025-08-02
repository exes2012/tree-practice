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
  selector: 'app-hesed-gevurah-line-practice',
  templateUrl: './hesed-gevurah-line-practice.component.html',
  styleUrls: ['./hesed-gevurah-line-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class HesedGevurahLinePracticeComponent implements OnDestroy {
  practiceStarted = false;
  streamSelected = false;
  selectedStream: string = '';
  isVoiceEnabled = true;

  stepDurationOptions = [10, 15, 30, 60];
  practiceDurationOptions = [1, 2, 5, 10, 15, 20, 30, 60];
  steps: PracticeStep[] = [];
  mainPracticeStepIndex = 5; // The step where the main practice begins

  currentStep = 0;
  stepTimer: number = 30;
  practiceTimer: number = 0;
  selectedStepDuration: number = 30;
  selectedPracticeDuration: number = 1;
  userRating: number = 5;

  stepInterval: any;
  practiceInterval: any;
  audio = new Audio('/assets/sound/bell.mp3');

  constructor(private location: Location, private practiceService: PracticeService) {}

  ngOnDestroy() {
    this.clearAllTimers();
    window.speechSynthesis.cancel();
  }

  goBack() {
    this.clearAllTimers();
    window.speechSynthesis.cancel();
    if (this.practiceStarted) {
      this.practiceStarted = false;
      this.streamSelected = true;
    } else if (this.streamSelected) {
      this.streamSelected = false;
    } else {
      this.location.back();
    }
  }

  toggleVoice() {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    if (!this.isVoiceEnabled) {
      window.speechSynthesis.cancel();
    }
  }

  speak(text: string) {
    if (!this.isVoiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, ''));
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  selectStream(stream: string) {
    this.selectedStream = stream;
    this.streamSelected = true;
    this.setSteps();
  }

  setStepDuration(seconds: number) {
    this.selectedStepDuration = seconds;
  }

  setPracticeDuration(minutes: number) {
    this.selectedPracticeDuration = minutes;
  }

  setSteps() {
    const commonSteps: { [key: string]: PracticeStep[] } = {
      creator: [
        { title: 'Шаг 1. Построение пространства', instruction: 'Почувствуй пространство, себя и свое тело в этом пространстве.' },
        { title: 'Шаг 2. Сфира Хесед', instruction: 'Почувствуй пространство справа от тебя.' },
        { title: 'Шаг 3. Сфира Хесед', instruction: 'Сконцентрируйся на состоянии безграничной любви к Творцу и стремлении к слиянию с Ним по свойствам.' },
        { title: 'Шаг 4. Сфира Гвура', instruction: 'Почувствуй пространство слева.' },
        { title: 'Шаг 5. Сфира Гвура', instruction: 'Сконцентрируйся на Трепете перед Творцом. И страхе потерять с Ним связь.' },
        { title: 'Шаг 6. Хесед/Гвура', instruction: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Безграничную любовь к Творцу (пространство справа).<br><br>2. Трепет перед Ним и страх потерять связь (пространство слева).<br><br>Удерживай себя, свое тело и эти два состояния.' },
        { title: 'Шаг 7. Оценка упражнения', instruction: 'Оцени, насколько хорошо у тебя получилось выполнить упражнение.' },
      ],
      self: [
        { title: 'Шаг 1. Построение пространства', instruction: 'Почувствуй пространство, себя и свое тело в этом пространстве.' },
        { title: 'Шаг 2. Сфира Хесед', instruction: 'Почувствуй пространство справа от тебя.' },
        { title: 'Шаг 3. Сфира Хесед', instruction: 'Сконцентрируйся на проявлении безусловного милосердия и принятия в отношении себя и своих недостатков.' },
        { title: 'Шаг 4. Сфира Гвура', instruction: 'Почувствуй пространство слева.' },
        { title: 'Шаг 5. Сфира Гвура', instruction: 'Сконцентрируйся на сознательном ограничении и преодолении своих эгоистических устремлений.' },
        { title: 'Шаг 6. Хесед/Гвура', instruction: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Безусловное милосердие к себе (пространство справа).<br><br>2. Сознательное ограничение эгоизма (пространство слева).<br><br>Удерживай себя, свое тело и эти два состояния.' },
        { title: 'Шаг 7. Оценка упражнения', instruction: 'Оцени, насколько хорошо у тебя получилось выполнить упражнение.' },
      ],
      others: [
        { title: 'Шаг 1. Построение пространства', instruction: 'Почувствуй пространство, себя и свое тело в этом пространстве.' },
        { title: 'Шаг 2. Сфира Хесед', instruction: 'Почувствуй пространство справа от тебя.' },
        { title: 'Шаг 3. Сфира Хесед', instruction: 'Сконцентрируйся на проявлении безусловного милосердия в отношении окружающих.' },
        { title: 'Шаг 4. Сфира Гвура', instruction: 'Почувствуй пространство слева.' },
        { title: 'Шаг 5. Сфира Гвура', instruction: 'Сконцентрируйся на проявлении справедливости и установке необходимых границ для истинного блага других.' },
        { title: 'Шаг 6. Хесед/Гвура', instruction: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Безусловное милосердие к другим (пространство справа).<br><br>2. Справедливость и установка границ (пространство слева).<br><br>Удерживай себя, свое тело и эти два состояния.' },
        { title: 'Шаг 7. Оценка упражнения', instruction: 'Оцени, насколько хорошо у тебя получилось выполнить упражнение.' },
      ]
    };
    this.steps = commonSteps[this.selectedStream];
  }

  startPractice() {
    this.practiceStarted = true;
    this.practiceTimer = this.selectedPracticeDuration * 60;
    this.currentStep = 0;
    this.startStepTimer();
    this.speak(this.steps[this.currentStep].instruction);
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
    this.practiceInterval = setInterval(() => {
      this.practiceTimer--;
      if (this.practiceTimer < 0) {
        this.finishPractice();
      }
    }, 1000);
  }

  nextStep() {
    this.clearAllTimers();
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      if (this.currentStep < this.steps.length - 1) {
        this.speak(this.steps[this.currentStep].instruction);
      }
      if (this.currentStep < this.mainPracticeStepIndex) {
        this.startStepTimer();
      } else if (this.currentStep === this.mainPracticeStepIndex) {
        this.startPracticeTimer();
      }
    }
  }

  previousStep() {
    this.clearAllTimers();
    if (this.currentStep > 0) {
      this.currentStep--;
      this.speak(this.steps[this.currentStep].instruction);
      if (this.currentStep < this.mainPracticeStepIndex) {
        this.startStepTimer();
      } else if (this.currentStep === this.mainPracticeStepIndex) {
        this.startPracticeTimer();
      }
    }
  }

  finishPractice() {
    this.clearAllTimers();
    this.audio.play();
    this.currentStep++; // Move to rating step
    window.speechSynthesis.cancel();
  }

  exitPractice() {
    this.practiceService.saveLastPractice({ name: 'Малое состояние - Линия Хесед/Гвура', route: '/practices/small-state/hesed-gevurah-line' });
    this.practiceService.recordPracticeCompletion();
    this.location.back();
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
