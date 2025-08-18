import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private repetitionInterval: any;
  private isRepetitionActive: boolean = false;
  private currentMainSpeech: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private speechQueue: Array<() => void> = [];

  private speechSettings = {
    main: { rate: 0.8, pause: 1000 },
    repetition: { rate: 0.9, pause: 200 }
  };

  speak(text: string, isRepetition: boolean = false): Promise<void> {
    return new Promise((resolve, reject) => {
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

      // Если это основная речь и уже идет другая основная речь - ждем
      if (!isRepetition && this.isSpeaking) {
        console.log('Queueing main speech - another speech is active');
        this.speechQueue.push(() => this.executeSpeech(text, isRepetition, resolve, reject));
        return;
      }

      this.executeSpeech(text, isRepetition, resolve, reject);
    });
  }

  private executeSpeech(text: string, isRepetition: boolean, resolve: Function, reject: Function): void {
    // Если это не повтор, ЖЕСТКО останавливаем всё предыдущее
    if (!isRepetition) {
      console.log('HARD STOPPING all speech for new main speech');
      
      // Очищаем состояния
      this.clearRepetitionOnly();
      this.currentMainSpeech = null;
      this.isSpeaking = false;
      this.speechQueue = [];
      
      // МГНОВЕННАЯ остановка
      this.forceStopAllSpeech();
      
      // Запускаем новую речь с небольшой задержкой
      setTimeout(() => {
        this.startMainSpeech(text, resolve, reject);
      }, 60);
    } else {
      this.startSpeech(text, isRepetition, resolve, reject);
    }
  }

  private startMainSpeech(text: string, resolve: Function, reject: Function): void {
    this.isSpeaking = true;
    this.startSpeech(text, false, () => {
      this.isSpeaking = false;
      resolve();
      this.processQueue();
    }, reject);
  }

  private startSpeech(text: string, isRepetition: boolean, resolve: Function, reject: Function): void {
    const cleanText = this.processTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const settings = isRepetition ? this.speechSettings.repetition : this.speechSettings.main;
    utterance.lang = 'ru-RU';
    utterance.rate = settings.rate;
    utterance.volume = isRepetition ? 0.8 : 1.0;

    if (!isRepetition) {
      this.currentMainSpeech = utterance;
    }

    let isCompleted = false;

    const complete = () => {
      if (isCompleted) return;
      isCompleted = true;

      console.log('Speech completed:', isRepetition ? 'repetition' : 'main');
      if (!isRepetition) {
        this.currentMainSpeech = null;
      }
      resolve();
    };

    utterance.onend = () => {
      console.log('Speech ended:', isRepetition ? 'repetition' : 'main');
      complete();
    };

    utterance.onerror = (event) => {
      // Игнорируем ошибку interrupted для повторов
      if (isRepetition && event.error === 'interrupted') {
        console.log('Repetition interrupted (expected)');
        complete();
        return;
      }

      console.error('Speech error:', event.error, isRepetition ? 'repetition' : 'main');
      complete();
    };

    console.log('Starting speech:', isRepetition ? 'repetition' : 'main', cleanText.substring(0, 50));
    window.speechSynthesis.speak(utterance);
  }

  private processQueue(): void {
    if (this.speechQueue.length > 0) {
      const next = this.speechQueue.shift();
      if (next) {
        setTimeout(() => next(), 100);
      }
    }
  }

  startRepetition(phrase: string, intervalMs: number = 5000): void {
    // Очищаем только интервал повторов, не трогая речь
    this.clearRepetitionOnly();
    this.isRepetitionActive = true;

    if (!phrase) return;

    // Первый повтор
    this.speak(phrase, true);

    // Последующие повторы
    this.repetitionInterval = setInterval(() => {
      if (this.isRepetitionActive && !this.currentMainSpeech) {
        this.speak(phrase, true);
      }
    }, intervalMs);
  }

  /**
   * Остановить повторы и дождаться их завершения
   */
  stopRepetitionAndWait(): Promise<void> {
    return new Promise((resolve) => {
      this.clearRepetitionOnly();
      
      // Ждем немного, чтобы завершить текущий повтор если он активен
      setTimeout(() => {
        resolve();
      }, 100);
    });
  }

  private clearRepetitionOnly(): void {
    console.log('Clearing repetition interval only');
    this.isRepetitionActive = false;
    if (this.repetitionInterval) {
      clearInterval(this.repetitionInterval);
      this.repetitionInterval = null;
    }
  }

  clearRepetition(): void {
    console.log('CLEAR REPETITION called');
    this.clearRepetitionOnly();

    // Отменяем речь только если нет основной речи
    if (!this.currentMainSpeech && !this.isSpeaking) {
      console.log('Canceling speech (no main speech active)');
      window.speechSynthesis.cancel();
    }
  }

  stopSpeech(): void {
    console.log('STOP SPEECH called - HARD STOP ALL');

    // Очищаем все флаги и состояния СРАЗУ
    this.clearRepetitionOnly();
    this.currentMainSpeech = null;
    this.isSpeaking = false;
    this.speechQueue = [];

    // МГНОВЕННАЯ остановка всей речи
    this.forceStopAllSpeech();
  }

  private forceStopAllSpeech(): void {
    try {
      // Многократная остановка для гарантии
      for (let i = 0; i < 5; i++) {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
          window.speechSynthesis.cancel();
        }
      }

      // Еще несколько проверок с микро-задержками
      const stopAttempts = [0, 5, 10, 20, 50];
      stopAttempts.forEach(delay => {
        setTimeout(() => {
          if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            console.log(`Force stop attempt at ${delay}ms`);
            window.speechSynthesis.cancel();
          }
        }, delay);
      });

    } catch (error) {
      console.error('Error in force stop:', error);
    }
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
