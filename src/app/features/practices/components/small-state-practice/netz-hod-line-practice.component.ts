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
  selector: 'app-netz-hod-line-practice',
  templateUrl: './netz-hod-line-practice.component.html',
  styleUrls: ['./netz-hod-line-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class NetzHodLinePracticeComponent implements OnDestroy {
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
            { title: 'Шаг 2. Сфира Нецах', instruction: 'Почувствуй пространство над тобой. Это сфира Нецах.' },
            { title: 'Шаг 3. Сфира Нецах', instruction: 'Сконцентрируйся на вере в единого Бога (отдача). Выстрой намерение навечно прилепиться к нему. И прикладывай стремление к своему намерению.' },
            { title: 'Шаг 4. Сфира Ход', instruction: 'Почувствуй пространство под тобой. Это сфира Ход' },
            { title: 'Шаг 5. Сфира Ход', instruction: 'Отталкивай от себя все мысли, говорящие об отсутствии единства. И о том, что есть что-то в этом мире, не являющееся Творцом.' },
            { title: 'Шаг 6. Нецах/Ход', instruction: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Веру в единого Бога и стремление к нему (пространство над тобой).<br><br>2. Отталкивание мыслей об отсутствии единства (пространство под тобой).<br><br>Удерживай себя, свое тело и эти два состояния.' },
            { title: 'Шаг 7. Оценка упражнения', instruction: 'Оцени, насколько хорошо у тебя получилось выполнить упражнение.' },
        ],
        self: [
            { title: 'Шаг 1. Построение пространства', instruction: 'Почувствуй пространство, себя и свое тело в этом пространстве.' },
            { title: 'Шаг 2. Сфира Нецах', instruction: 'Почувствуй пространство над тобой. Это сфира Нецах' },
            { title: 'Шаг 3. Сфира Нецах', instruction: 'Почувствуй свои внутренние недостатки. Проявляй упорство и внутреннюю выносливость, стремясь к Творцу снизу вверх и прося Творца исправить твои сосуды.' },
            { title: 'Шаг 4. Сфира Ход', instruction: 'Почувствуй пространство под тобой. Это сфира Ход' },
            { title: 'Шаг 5. Сфира Ход', instruction: 'Сконцентрируйся на принятии своего текущего места в системе мироздания. Согласись с управлением Творца. Что есть, то и хорошо.' },
            { title: 'Шаг 6. Нецах/Ход', instruction: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Упорство в просьбе исправить твои сосуды (пространство над тобой).<br><br>2. Принятие своего места и управления Творца (пространство под тобой).<br><br>Удерживай себя, свое тело и эти два состояния.' },
            { title: 'Шаг 7. Оценка упражнения', instruction: 'Оцени, насколько хорошо у тебя получилось выполнить упражнение.' },
        ],
        others: [
            { title: 'Шаг 1. Построение пространства', instruction: 'Почувствуй пространство, себя и свое тело в этом пространстве.' },
            { title: 'Шаг 2. Сфира Нецах', instruction: 'Почувствуй пространство над тобой. Это сфира Нецах.' },
            { title: 'Шаг 3. Сфира Нецах', instruction: 'Проси творца дать тебе сосуды, позволяющие вдохновлять других своей настойчивостью и верой на преодоление трудностей.' },
            { title: 'Шаг 4. Сфира Ход', instruction: 'Почувствуй пространство под тобой. Это сфира Ход' },
            { title: 'Шаг 5. Сфира Ход', instruction: 'Сконцентрируйся на том, чтобы стать для других примером смирения и благодарности. Проси Творца дать тебе такие келим.' },
            { title: 'Шаг 6. Нецах/Ход', instruction: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Просьба о сосудах для вдохновления других (пространство над тобой).<br><br>2. Просьба стать примером смирения и благодарности (пространство под тобой).<br><br>Прикладывай стремление.' },
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
    this.practiceService.saveLastPractice({ name: 'Малое состояние - Линия Нецах/Ход', route: '/practices/small-state/netz-hod-line' });
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
