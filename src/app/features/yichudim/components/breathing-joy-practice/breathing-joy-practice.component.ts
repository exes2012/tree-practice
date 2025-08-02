import { Component, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-breathing-joy-practice',
  templateUrl: './breathing-joy-practice.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BreathingJoyPracticeComponent implements OnDestroy {
  isPracticeStarted = false;
  currentStepIndex = 0;
  isVoiceEnabled = false;
  userRating = 5;

  // Interactive breathing properties
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
      instruction: 'Царь Давид заканчивает книгу Теилим стихом: «Каждая душа, воздай хвалу Богу Алелу-йя». На святом языке слова «душа» и «дыхание» очень близки – нешама и нешима.',
      stage: 'Подготовка',
      stageColor: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    },
    { 
      title: 'Дыхание хвалы', 
      instruction: 'Этот стих можно прочитать как «Каждое дыхание, воздай хвалу Богу Алелу-йя». Давайте глубоко дышать и славить Бога с каждым дыханием.',
      stage: 'Хвала',
      stageColor: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    },
    { 
      title: 'Ощущение присутствия', 
      instruction: 'С каждым дыханием я чувствую Твое Присутствие. С каждым дыханием я выражаю Тебе благодарность за Твой драгоценный дар мне – жизнь.',
      stage: 'Присутствие',
      stageColor: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    },
    { 
      title: 'Слово радость', 
      instruction: 'Теперь мы будем дышать радостью. Вдохнем в нашу жизнь радость. Слово «радость» на иврите – хедва. Оно состоит из четырех букв хет, далет, вав и хей: ח ד ו ה',
      stage: 'Радость',
      stageColor: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
    },
    { 
      title: 'Четыре этапа дыхания', 
      instruction: 'Каждый дыхательный цикл состоит из четырех этапов: вдох, удерживание, выдох и отдых. Числовые значения букв слова хедва – 8, 4, 6 и 5.',
      stage: 'Этапы',
      stageColor: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    },
    { 
      title: 'Практика дыхания', 
      instruction: 'Вдох на счет 8 (хет), удерживание на счет 4 (далет), выдох на счет 6 (вав), отдых на счет 5 (хей). Дышите естественно, поддерживая соотношение 8:4:6:5.',
      stage: 'Дыхание',
      stageColor: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
    },
    { 
      title: 'Ощущение жизни', 
      instruction: 'Ощущать жизнь – значит ощущать радость. Это радость от ощущения того, как мой Создатель вдыхает в мои ноздри дыхание жизни. С каждым дыханием я славлю Его.',
      stage: 'Жизнь',
      stageColor: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
    }
  ];

  constructor(private location: Location) {}

  ngOnDestroy() {
    window.speechSynthesis.cancel();
    this.stopBreathing();
  }

  goBack() {
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
    if (this.isVoiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }

  startPractice() {
    this.isPracticeStarted = true;
    this.currentStepIndex = 0;
    this.speak(this.practiceSteps[0].instruction);
  }

  nextStep() {
    this.stopBreathing(); // Stop breathing when navigating
    if (this.currentStepIndex < this.practiceSteps.length - 1) {
      this.currentStepIndex++;
      if (!this.isBreathingStep()) {
        this.speak(this.practiceSteps[this.currentStepIndex].instruction);
      }
    }
  }

  previousStep() {
    this.stopBreathing(); // Stop breathing when navigating
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      if (!this.isBreathingStep()) {
        this.speak(this.practiceSteps[this.currentStepIndex].instruction);
      }
    }
  }

  finishPractice() {
    this.currentStepIndex = this.practiceSteps.length; // Move to rating step
    window.speechSynthesis.cancel();
  }

  exitPractice() {
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

  // Interactive breathing methods
  startBreathing() {
    this.isBreathingActive = true;
    this.breathingTimer = 0;
    this.breathingCycles = 0;
    this.startBreathingCycle();

    // Start main timer
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

    window.speechSynthesis.cancel();
  }

  private startBreathingCycle() {
    if (!this.isBreathingActive) return;

    this.breathingCycles++;
    this.startInhale();
  }

  private startInhale() {
    this.breathingState = 'inhale';
    this.breathingPhaseTimer = 8;
    this.speakWithStress('Вдох');

    this.breathingPhaseInterval = setInterval(() => {
      this.breathingPhaseTimer--;
      if (this.breathingPhaseTimer <= 0) {
        clearInterval(this.breathingPhaseInterval);
        this.startHold();
      }
    }, 1000);
  }

  private startHold() {
    this.breathingState = 'hold';
    this.breathingPhaseTimer = 4;
    // Try phonetic spelling for better pronunciation
    this.speakWithStress('Задержи́те дыхание');

    this.breathingPhaseInterval = setInterval(() => {
      this.breathingPhaseTimer--;
      if (this.breathingPhaseTimer <= 0) {
        clearInterval(this.breathingPhaseInterval);
        this.startExhale();
      }
    }, 1000);
  }

  private startExhale() {
    this.breathingState = 'exhale';
    this.breathingPhaseTimer = 6;
    this.speakWithStress('Вы́дох');

    this.breathingPhaseInterval = setInterval(() => {
      this.breathingPhaseTimer--;
      if (this.breathingPhaseTimer <= 0) {
        clearInterval(this.breathingPhaseInterval);
        this.startPause();
      }
    }, 1000);
  }

  private startPause() {
    this.breathingState = 'pause';
    this.breathingPhaseTimer = 5;
    this.speakWithStress('Отдых');

    this.breathingPhaseInterval = setInterval(() => {
      this.breathingPhaseTimer--;
      if (this.breathingPhaseTimer <= 0) {
        clearInterval(this.breathingPhaseInterval);
        this.startBreathingCycle(); // Start next cycle
      }
    }, 1000);
  }

  getBreathingStateText(): string {
    switch (this.breathingState) {
      case 'inhale': return 'Вдох';
      case 'hold': return 'Задержи́те';
      case 'exhale': return 'Вы́дох';
      case 'pause': return 'Отдых';
      default: return 'Готов к началу';
    }
  }

  getFormattedTimer(): string {
    const minutes = Math.floor(this.breathingTimer / 60);
    const seconds = this.breathingTimer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  isBreathingStep(): boolean {
    return this.currentStepIndex === 5; // "Практика дыхания" step
  }

  private speakWithStress(text: string) {
    if (!this.isVoiceEnabled) return;

    // Create pronunciation map for better speech
    const pronunciationMap: { [key: string]: string } = {
      'Задержи́те дыхание': 'Задержите дыхание',
      'Вы́дох': 'Выдох',
      'Отдых': 'Отдых',
      'Вдох': 'Вдох'
    };

    // Use mapped pronunciation or original text
    const speechText = pronunciationMap[text] || text.replace(/́/g, '');

    // Create utterance with optimized settings
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.7; // Slower for meditation
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    // Try to find the best Russian voice
    const voices = speechSynthesis.getVoices();
    const russianVoice = voices.find(voice =>
      voice.lang.startsWith('ru') ||
      voice.name.toLowerCase().includes('russian') ||
      voice.name.toLowerCase().includes('ru')
    );

    if (russianVoice) {
      utterance.voice = russianVoice;
    }

    // Add slight pause before speaking for better timing
    setTimeout(() => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }, 100);
  }
}
