# Проблема с речевым синтезом в Angular приложении

## Описание проблемы

В Angular приложении для практик медитации есть компонент `practice-runner` который:
1. Озвучивает инструкции шагов через SpeechSynthesis API
2. На некоторых шагах должен запускать повторы фраз после завершения основной инструкции

**Текущие проблемы:**
1. Основная речь прерывается ошибкой "Speech error: interrupted main" 
2. События `onend` и `onerror` дублируются в логах консоли
3. В консоли показывается несколько раз подряд "Main speech finished!", "Speech ended: main"
4. Это происходит даже на шагах БЕЗ повторов (шаг 1)

## Код SpeechService

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private repetitionInterval: any;
  private isRepetitionActive: boolean = false;
  private currentMainSpeech: SpeechSynthesisUtterance | null = null;
  private repetitionDelay: number = 1000;
  private repetitionPause: number = 500;
  
  private speechSettings = {
    main: { rate: 0.8, pause: 1000 },
    repetition: { rate: 0.9, pause: 200 }
  };

  speak(text: string, isRepetition: boolean = false): Promise<void> {
    return new Promise((resolve) => {
      if (!text) {
        resolve();
        return;
      }
      
      // Если это повтор и сейчас говорит основная речь - пропускаем
      if (isRepetition && this.currentMainSpeech) {
        console.log('Skipping repetition - main speech is active');
        resolve();
        return;
      }
      
      // Если это не повтор, останавливаем всё предыдущее
      if (!isRepetition) {
        console.log('CANCELING previous speech for new main speech');
        window.speechSynthesis.cancel();
        this.currentMainSpeech = null;
      }
      
      const cleanText = this.processTextForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      const settings = isRepetition ? this.speechSettings.repetition : this.speechSettings.main;
      utterance.lang = 'ru-RU';
      utterance.rate = settings.rate;
      utterance.volume = isRepetition ? 0.8 : 1.0;
      
      if (!isRepetition) {
        this.currentMainSpeech = utterance;
      }
      
      let isResolved = false;
      
      utterance.onend = () => {
        if (isResolved) return;
        isResolved = true;
        console.log('Speech ended:', isRepetition ? 'repetition' : 'main');
        if (!isRepetition) {
          this.currentMainSpeech = null;
        }
        resolve();
      };
      
      utterance.onerror = (event) => {
        if (isResolved) return;
        isResolved = true;
        console.error('Speech error:', event.error, isRepetition ? 'repetition' : 'main');
        if (!isRepetition) {
          this.currentMainSpeech = null;
        }
        resolve();
      };
      
      console.log('Starting speech:', isRepetition ? 'repetition' : 'main', cleanText.substring(0, 50));
      window.speechSynthesis.speak(utterance);
    });
  }

  startRepetition(phrase: string, intervalMs: number = 5000): void {
    this.clearRepetition();
    this.isRepetitionActive = true;
    
    if (!phrase) return;
    
    this.speak(phrase, true);
    this.repetitionInterval = setInterval(() => {
      if (this.isRepetitionActive) {
        this.speak(phrase, true);
      }
    }, intervalMs);
  }

  clearRepetition(): void {
    console.log('CLEAR REPETITION called');
    this.isRepetitionActive = false;
    if (this.repetitionInterval) {
      clearInterval(this.repetitionInterval);
      this.repetitionInterval = null;
    }
    if (!this.currentMainSpeech) {
      console.log('CANCELING speech in clearRepetition (no main speech)');
      window.speechSynthesis.cancel();
    } else {
      console.log('NOT canceling speech - main speech is active');
    }
  }

  stopSpeech(): void {
    this.clearRepetition();
    this.currentMainSpeech = null;
    window.speechSynthesis.cancel();
  }

  getIsRepetitionActive(): boolean {
    return this.isRepetitionActive;
  }

  private processTextForSpeech(text: string): string {
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/\n+/g, '. ')
      .replace(/\.\.+/g, '.')
      .replace(/([.!?])\s*([А-Я])/g, '$1 $2')
      .trim();
  }
}
```

## Код компонента (ключевые методы)

```typescript
export class PracticeRunnerComponent implements OnInit, OnDestroy {
  isRepetitionActive = true; // По умолчанию включен
  // ... другие свойства

  ngOnInit(): void {
    this.subscriptions.add(
      this.practiceEngine.currentStep.subscribe(step => {
        this.currentStep = step;
        if (step) {
          this.prepareStepUI(step);
          if (!this.showStartScreen) {
            this.speakCurrentStep();
          }
        }
      })
    );
    // ... другие подписки
  }

  private prepareStepUI(step: PracticeStep): void {
    console.log('PREPARE STEP UI called for step:', step.id);
    
    // Инициализация полей ввода...
    
    // Всегда останавливаем предыдущие повторы
    this.speechService.clearRepetition();
    
    // Устанавливаем состояние для шагов с повторами
    this.isRepetitionActive = !!(step.repeatablePhrase && step.showToggleRepetition && this.isVoiceEnabled && !this.showStartScreen);
  }

  private async speakCurrentStep(): Promise<void> {
    if (this.isVoiceEnabled && this.currentStep) {
      console.log('Speaking step instruction...');
      
      // 1. Ждем РЕАЛЬНОГО завершения основной речи
      await this.speechService.speak(this.currentStep.instruction);
      console.log('Main speech finished!');
      
      // 2. Ждем еще немного чтобы избежать interrupted
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 3. Теперь запускаем повтор, если нужно
      if (this.isRepetitionActive && this.currentStep.repeatablePhrase) {
        console.log('Starting repetition...');
        this.speechService.startRepetition(this.currentStep.repeatablePhrase);
      }
    }
  }

  private resetStepUI(): void {
    this.speechService.clearRepetition();
    this.userInput = '';
    this.userRating = 5;
  }

  async onNextClick(): Promise<void> {
    const inputValue = this.getCurrentInputValue();
    await this.practiceEngine.nextStep(inputValue);
    this.resetStepUI();
  }
}
```

## Последовательность вызовов

1. При переходе на новый шаг вызывается `prepareStepUI()`
2. В `prepareStepUI()` вызывается `speechService.clearRepetition()`
3. Затем вызывается `speakCurrentStep()`
4. В `speakCurrentStep()` вызывается `await speechService.speak(instruction)`
5. После завершения основной речи может запускаться `startRepetition()`

## Желаемое поведение

1. Основная инструкция должна проговариваться ПОЛНОСТЬЮ без прерываний
2. После завершения основной инструкции (на шагах с повторами) должен автоматически начинаться повтор фразы каждые 5 секунд
3. Никаких дублированных событий или ошибок interrupted

## Вопросы

1. Почему события `onend`/`onerror` дублируются даже с флагом `isResolved`?
2. Что вызывает ошибку "interrupted" даже на шагах без повторов?
3. Как правильно организовать последовательность: основная речь → пауза → повторы?

Возможно проблема в том, что Angular вызывает подписку на `currentStep` несколько раз или есть конфликт между разными вызовами `speechSynthesis.cancel()`.