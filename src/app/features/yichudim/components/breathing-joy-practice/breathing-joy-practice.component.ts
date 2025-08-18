import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PracticeLayoutComponent } from '@app/shared/components/practice-layout/practice-layout.component';
import { PracticeService } from '@app/core/services/practice.service';

@Component({
  selector: 'app-breathing-joy-practice',
  templateUrl: './breathing-joy-practice.component.html',
  styleUrls: ['./breathing-joy-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PracticeLayoutComponent],
})
export class BreathingJoyPracticeComponent implements OnDestroy {
  practiceTitle = 'Дышать радостью';
  practiceSubtitle = 'Дышать как хвалу Творцу';
  description =
    '«Каждое дыхание, воздай хвалу Богу». Мы будем дышать радостью, используя ивритское слово חדוה (хедва) для ритма дыхания. Четыре буквы слова "радость" соответствуют четырем этапам дыхательного цикла: вдох (8), удерживание (4), выдох (6), отдых (5).';
  time = '20 мин';
  level = 'Начальный';
  showTimer = false;

  isBreathingActive = false;
  breathingState: 'stopped' | 'inhale' | 'hold' | 'exhale' | 'pause' = 'stopped';
  breathingTimer = 0;
  breathingInterval: any;
  breathingCycles = 0;
  breathingPhaseTimer = 0;
  breathingPhaseInterval: any;

  practiceSteps = [
    {
      title: 'Подготовка',
      instruction:
        'Царь Давид заканчивает книгу Теилим стихом: «Каждая душа, воздай хвалу Богу Алелу-йя». На святом языке слова «душа» и «дыхание» очень близки – нешама и нешима.',
      stage: 'Подготовка',
      stageColor: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    },
    {
      title: 'Дыхание хвалы',
      instruction:
        'Этот стих можно прочитать как «Каждое дыхание, воздай хвалу Богу Алелу-йя». Давайте глубоко дышать и славить Бога с каждым дыханием.',
      stage: 'Хвала',
      stageColor: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    },
    {
      title: 'Ощущение присутствия',
      instruction:
        'С каждым дыханием я чувствую Твое Присутствие. С каждым дыханием я выражаю Тебе благодарность за Твой драгоценный дар мне – жизнь.',
      stage: 'Присутствие',
      stageColor: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    },
    {
      title: 'Слово радость',
      instruction:
        'Теперь мы будем дышать радостью. Вдохнем в нашу жизнь радость. Слово «радость» на иврите – хедва. Оно состоит из четырех букв хет, далет, вав и хей: ח ד ו ה',
      stage: 'Радость',
      stageColor: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
    },
    {
      title: 'Четыре этапа дыхания',
      instruction:
        'Каждый дыхательный цикл состоит из четырех этапов: вдох, удерживание, выдох и отдых. Числовые значения букв слова хедва – 8, 4, 6 и 5.',
      stage: 'Этапы',
      stageColor: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    },
    {
      title: 'Практика дыхания',
      instruction:
        'Вдох на счет 8 (хет), удерживание на счет 4 (далет), выдох на счет 6 (вав), отдых на счет 5 (хей). Дышите естественно, поддерживая соотношение 8:4:6:5.',
      stage: 'Дыхание',
      stageColor: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
    },
    {
      title: 'Ощущение жизни',
      instruction:
        'Ощущать жизнь – значит ощущать радость. Это радость от ощущения того, как мой Создатель вдыхает в мои ноздри дыхание жизни. С каждым дыханием я славлю Его.',
      stage: 'Жизнь',
      stageColor: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    },
    { title: 'Оценка', instruction: 'Как прошла практика?' },
  ];

  constructor(private practiceService: PracticeService) {}

  ngOnDestroy() {
    this.stopBreathing();
  }

  onPracticeFinished(event: { rating: number }) {
    this.practiceService.saveLastPractice({
      name: this.practiceTitle,
      route: '/yichudim/breathing-joy',
    });
    this.practiceService.recordPracticeCompletion();
  }

  startBreathing() {
    this.isBreathingActive = true;
    this.breathingTimer = 0;
    this.breathingCycles = 0;
    this.startBreathingCycle();

    this.breathingInterval = setInterval(() => {
      this.breathingTimer++;
    }, 1000);
  }

  stopBreathing() {
    this.isBreathingActive = false;
    this.breathingState = 'stopped';

    if (this.breathingInterval) {
      clearInterval(this.breathingInterval);
    }
    if (this.breathingPhaseInterval) {
      clearInterval(this.breathingPhaseInterval);
    }
  }

  private startBreathingCycle() {
    if (!this.isBreathingActive) return;

    this.breathingCycles++;
    this.startInhale();
  }

  private startInhale() {
    this.breathingState = 'inhale';
    this.breathingPhaseTimer = 8;
    this.speak('Вдох');
    this.startPhaseTimer(() => this.startHold());
  }

  private startHold() {
    this.breathingState = 'hold';
    this.breathingPhaseTimer = 4;
    this.speak('Задержка');
    this.startPhaseTimer(() => this.startExhale());
  }

  private startExhale() {
    this.breathingState = 'exhale';
    this.breathingPhaseTimer = 6;
    this.speak('Выдох');
    this.startPhaseTimer(() => this.startPause());
  }

  private startPause() {
    this.breathingState = 'pause';
    this.breathingPhaseTimer = 5;
    this.speak('Пауза');
    this.startPhaseTimer(() => this.startBreathingCycle());
  }

  private startPhaseTimer(nextPhase: () => void) {
    this.breathingPhaseInterval = setInterval(() => {
      this.breathingPhaseTimer--;
      if (this.breathingPhaseTimer <= 0) {
        clearInterval(this.breathingPhaseInterval);
        nextPhase();
      }
    }, 1000);
  }

  getBreathingStateText(): string {
    switch (this.breathingState) {
      case 'inhale':
        return 'Вдох';
      case 'hold':
        return 'Задержка';
      case 'exhale':
        return 'Выдох';
      case 'pause':
        return 'Пауза';
      default:
        return 'Старт';
    }
  }

  getFormattedTimer(): string {
    const minutes = Math.floor(this.breathingTimer / 60);
    const seconds = this.breathingTimer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private speak(text: string) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.8;
      utterance.volume = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  }
}
