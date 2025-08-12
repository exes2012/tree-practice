Отличная архитектура с generator-функциями! Это действительно элегантное решение для медитативных практик. Давайте решим обе проблемы и проведем архитектурную рецензию.
Решение проблем
1. Полноценная навигация "Назад" для generator-based архитектуры

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Интерфейс для сохранения состояния генератора
interface GeneratorSnapshot {
  stepIndex: number;
  step: PracticeStep;
  contextSnapshot: Map<string, any>;
  userInput?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PracticeEngineV2Service {
  private currentStep$ = new BehaviorSubject<PracticeStep | null>(null);
  private practiceIterator: AsyncIterableIterator<PracticeStep> | null = null;
  private practiceGeneratorFactory: ((context: PracticeContext) => AsyncIterableIterator<PracticeStep>) | null = null;
  private context: PracticeContext;
  
  // Улучшенная система истории для навигации назад
  private generatorSnapshots: GeneratorSnapshot[] = [];
  private currentSnapshotIndex: number = -1;
  
  get currentStep(): Observable<PracticeStep | null> {
    return this.currentStep$.asObservable();
  }

  constructor() {
    this.context = new PracticeContext();
  }

  /**
   * Инициализация практики с сохранением фабрики генератора
   */
  async startPractice(
    practiceGenerator: (context: PracticeContext) => AsyncIterableIterator<PracticeStep>
  ): Promise<void> {
    // Сохраняем фабрику для возможности пересоздания
    this.practiceGeneratorFactory = practiceGenerator;
    
    // Сбрасываем состояние
    this.generatorSnapshots = [];
    this.currentSnapshotIndex = -1;
    this.context.clear();
    
    // Создаем новый итератор
    this.practiceIterator = practiceGenerator(this.context);
    
    // Делаем первый шаг
    await this.nextStep();
  }

  /**
   * Переход к следующему шагу с сохранением снимка состояния
   */
  async nextStep(userInput?: any): Promise<void> {
    if (!this.practiceIterator) return;

    try {
      // Если есть пользовательский ввод от предыдущего шага
      if (userInput !== undefined && this.currentSnapshotIndex >= 0) {
        const currentSnapshot = this.generatorSnapshots[this.currentSnapshotIndex];
        if (currentSnapshot.step.inputConfig) {
          this.context.set(currentSnapshot.step.inputConfig.field, userInput);
          currentSnapshot.userInput = userInput;
        }
      }

      // Получаем следующий шаг
      const result = await this.practiceIterator.next(userInput);
      
      if (result.done) {
        this.handlePracticeComplete(result.value);
        return;
      }

      const step = result.value;
      
      // Создаем снимок текущего состояния
      const snapshot: GeneratorSnapshot = {
        stepIndex: this.currentSnapshotIndex + 1,
        step: step,
        contextSnapshot: new Map(this.context.getAllEntries()),
        userInput: undefined
      };

      // Обрезаем историю, если мы вернулись назад и пошли по новому пути
      if (this.currentSnapshotIndex < this.generatorSnapshots.length - 1) {
        this.generatorSnapshots = this.generatorSnapshots.slice(0, this.currentSnapshotIndex + 1);
      }

      // Добавляем снимок в историю
      this.generatorSnapshots.push(snapshot);
      this.currentSnapshotIndex++;
      
      // Эмитим новый шаг
      this.currentStep$.next(step);
      
    } catch (error) {
      console.error('Error in nextStep:', error);
      throw error;
    }
  }

  /**
   * Полноценная навигация назад с восстановлением состояния
   */
  async goBack(): Promise<void> {
    if (this.currentSnapshotIndex <= 0 || !this.practiceGeneratorFactory) {
      return; // Нельзя вернуться назад с первого шага
    }

    // Переходим к предыдущему снимку
    this.currentSnapshotIndex--;
    
    // Пересоздаем генератор и восстанавливаем состояние
    await this.restoreToSnapshot(this.currentSnapshotIndex);
  }

  /**
   * Переход к конкретному шагу по индексу
   */
  async goToStep(stepIndex: number): Promise<void> {
    if (stepIndex < 0 || stepIndex >= this.generatorSnapshots.length) {
      console.warn(`Invalid step index: ${stepIndex}`);
      return;
    }

    this.currentSnapshotIndex = stepIndex;
    await this.restoreToSnapshot(stepIndex);
  }

  /**
   * Восстановление состояния генератора до определенного снимка
   */
  private async restoreToSnapshot(targetIndex: number): Promise<void> {
    if (!this.practiceGeneratorFactory) return;

    // Создаем новый контекст
    this.context = new PracticeContext();
    
    // Создаем новый итератор
    this.practiceIterator = this.practiceGeneratorFactory(this.context);
    
    // Проигрываем все шаги до целевого
    for (let i = 0; i <= targetIndex; i++) {
      const snapshot = this.generatorSnapshots[i];
      
      // Восстанавливаем контекст до состояния на момент этого шага
      if (i > 0 && snapshot.contextSnapshot) {
        for (const [key, value] of snapshot.contextSnapshot) {
          this.context.set(key, value);
        }
      }
      
      // Для последнего шага не вызываем next, а просто эмитим
      if (i === targetIndex) {
        this.currentStep$.next(snapshot.step);
      } else {
        // Проматываем генератор до нужного места
        const result = await this.practiceIterator.next(snapshot.userInput);
        if (result.done) {
          console.error('Unexpected end of generator during restoration');
          break;
        }
      }
    }
  }

  /**
   * Альтернативная реализация через мемоизацию (более эффективная для частых переходов)
   */
  async goBackOptimized(): Promise<void> {
    if (this.currentSnapshotIndex <= 0) return;

    // Просто переключаемся на предыдущий снимок
    this.currentSnapshotIndex--;
    const snapshot = this.generatorSnapshots[this.currentSnapshotIndex];
    
    // Восстанавливаем контекст
    this.context.clear();
    for (const [key, value] of snapshot.contextSnapshot) {
      this.context.set(key, value);
    }
    
    // Эмитим сохраненный шаг
    this.currentStep$.next(snapshot.step);
  }

  /**
   * Проверка возможности навигации
   */
  canGoBack(): boolean {
    return this.currentSnapshotIndex > 0;
  }

  canGoForward(): boolean {
    return this.currentSnapshotIndex < this.generatorSnapshots.length - 1;
  }

  /**
   * Переход вперед (если мы вернулись назад)
   */
  async goForward(): Promise<void> {
    if (!this.canGoForward()) return;
    
    this.currentSnapshotIndex++;
    const snapshot = this.generatorSnapshots[this.currentSnapshotIndex];
    
    // Восстанавливаем контекст
    this.context.clear();
    for (const [key, value] of snapshot.contextSnapshot) {
      this.context.set(key, value);
    }
    
    this.currentStep$.next(snapshot.step);
  }

  /**
   * Получение истории навигации для UI
   */
  getNavigationHistory(): { steps: PracticeStep[], currentIndex: number } {
    return {
      steps: this.generatorSnapshots.map(s => s.step),
      currentIndex: this.currentSnapshotIndex
    };
  }

  private handlePracticeComplete(returnValue: any): void {
    console.log('Practice completed with return value:', returnValue);
    this.currentStep$.next(null);
  }

  /**
   * Очистка ресурсов
   */
  dispose(): void {
    this.generatorSnapshots = [];
    this.currentSnapshotIndex = -1;
    this.practiceIterator = null;
    this.practiceGeneratorFactory = null;
    this.context.clear();
    this.currentStep$.next(null);
  }
}

/**
 * Улучшенный контекст практики с поддержкой снимков
 */
export class PracticeContext {
  private data = new Map<string, any>();
  
  set(key: string, value: any): void {
    this.data.set(key, value);
  }
  
  get(key: string): any {
    return this.data.get(key);
  }
  
  has(key: string): boolean {
    return this.data.has(key);
  }
  
  clear(): void {
    this.data.clear();
  }
  
  getAllEntries(): Map<string, any> {
    return new Map(this.data);
  }
  
  // Восстановление из снимка
  restoreFromSnapshot(snapshot: Map<string, any>): void {
    this.data.clear();
    for (const [key, value] of snapshot) {
      this.data.set(key, value);
    }
  }
  
  // Интерполяция плейсхолдеров в тексте
  interpolate(text: string): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return this.has(key) ? this.get(key) : match;
    });
  }
}

2. SpeechService с настраиваемыми паузами между предложениями

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Конфигурация пауз для медитативной речи
 */
export interface PauseConfig {
  betweenSentences: number;      // Пауза между предложениями (мс)
  betweenCycles: number;          // Пауза между циклами повторов (мс)
  afterComma: number;             // Пауза после запятой (мс)
  breathingPause: number;         // Пауза для дыхания (мс)
  enableDynamicPauses: boolean;   // Адаптивные паузы на основе длины предложений
}

/**
 * Сегмент речи с типом паузы
 */
interface SpeechSegment {
  text: string;
  pauseAfter: number;
  type: 'sentence' | 'phrase' | 'breathing' | 'cycle';
}

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private synth = window.speechSynthesis;
  private currentMainSpeech: SpeechSynthesisUtterance | null = null;
  private repetitionInterval: any = null;
  private isRepetitionActive = false;
  private speechQueue: SpeechSegment[] = [];
  private isProcessingQueue = false;
  
  // Конфигурация пауз по умолчанию
  private pauseConfig: PauseConfig = {
    betweenSentences: 1000,
    betweenCycles: 2000,
    afterComma: 500,
    breathingPause: 1500,
    enableDynamicPauses: true
  };
  
  // Настройки голоса
  private voiceSettings = {
    rate: 0.9,        // Скорость речи
    pitch: 1.0,       // Тон голоса
    volume: 1.0,      // Громкость
    meditativeRate: 0.8  // Замедленная скорость для медитативных фраз
  };
  
  // Observable для состояния речи
  private isSpeaking$ = new BehaviorSubject<boolean>(false);
  
  get isSpeaking(): Observable<boolean> {
    return this.isSpeaking$.asObservable();
  }

  constructor() {
    this.initializeSpeechHandlers();
  }

  /**
   * Обновление конфигурации пауз
   */
  updatePauseConfig(config: Partial<PauseConfig>): void {
    this.pauseConfig = { ...this.pauseConfig, ...config };
  }

  /**
   * Парсинг текста на сегменты с учетом знаков препинания
   */
  private parseTextIntoSegments(text: string, type: 'main' | 'repetition' = 'main'): SpeechSegment[] {
    const segments: SpeechSegment[] = [];
    
    // Обработка плейсхолдеров
    text = this.processPlaceholders(text);
    
    // Разбиваем на предложения с учетом различных знаков
    const sentenceRegex = /([^.!?]+[.!?]+)/g;
    const sentences = text.match(sentenceRegex) || [text];
    
    sentences.forEach((sentence, index) => {
      sentence = sentence.trim();
      if (!sentence) return;
      
      // Проверяем на наличие запятых для дополнительных пауз
      if (this.pauseConfig.afterComma > 0 && sentence.includes(',')) {
        const phrases = sentence.split(',').map(p => p.trim());
        phrases.forEach((phrase, phraseIndex) => {
          if (!phrase) return;
          
          // Добавляем запятую обратно, кроме последней фразы
          const phraseText = phraseIndex < phrases.length - 1 ? phrase + ',' : phrase;
          
          segments.push({
            text: phraseText,
            pauseAfter: phraseIndex < phrases.length - 1 
              ? this.pauseConfig.afterComma 
              : this.calculatePauseAfterSentence(sentence, type),
            type: 'phrase'
          });
        });
      } else {
        // Обычное предложение без запятых
        segments.push({
          text: sentence,
          pauseAfter: this.calculatePauseAfterSentence(sentence, type),
          type: 'sentence'
        });
      }
      
      // Добавляем дыхательную паузу после каждых 3 предложений
      if (type === 'repetition' && (index + 1) % 3 === 0) {
        segments.push({
          text: '',
          pauseAfter: this.pauseConfig.breathingPause,
          type: 'breathing'
        });
      }
    });
    
    return segments;
  }

  /**
   * Расчет паузы после предложения
   */
  private calculatePauseAfterSentence(sentence: string, type: string): number {
    let basePause = this.pauseConfig.betweenSentences;
    
    // Адаптивные паузы на основе длины предложения
    if (this.pauseConfig.enableDynamicPauses) {
      const wordCount = sentence.split(' ').length;
      
      // Короткие предложения (< 5 слов) - короткая пауза
      if (wordCount < 5) {
        basePause *= 0.7;
      }
      // Длинные предложения (> 15 слов) - длинная пауза
      else if (wordCount > 15) {
        basePause *= 1.3;
      }
      
      // Вопросительные предложения - немного длиннее пауза
      if (sentence.endsWith('?')) {
        basePause *= 1.2;
      }
      
      // Восклицательные предложения - динамичная пауза
      if (sentence.endsWith('!')) {
        basePause *= 0.9;
      }
    }
    
    // Для медитативных повторов паузы длиннее
    if (type === 'repetition') {
      basePause *= 1.2;
    }
    
    return Math.round(basePause);
  }

  /**
   * Обработка плейсхолдеров в тексте
   */
  private processPlaceholders(text: string): string {
    // Здесь должна быть интеграция с контекстом практики
    // Пока просто возвращаем текст как есть
    return text;
  }

  /**
   * Основной метод озвучивания с поддержкой сегментов
   */
  async speak(text: string, isRepetition: boolean = false): Promise<void> {
    if (!text) return;
    
    // Останавливаем текущую речь
    this.stopCurrentSpeech();
    
    // Парсим текст на сегменты
    const segments = this.parseTextIntoSegments(text, isRepetition ? 'repetition' : 'main');
    
    // Добавляем сегменты в очередь
    this.speechQueue = segments;
    
    // Обрабатываем очередь
    await this.processSegmentQueue(isRepetition);
  }

  /**
   * Обработка очереди сегментов речи
   */
  private async processSegmentQueue(isRepetition: boolean): Promise<void> {
    if (this.isProcessingQueue || this.speechQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    this.isSpeaking$.next(true);
    
    while (this.speechQueue.length > 0) {
      const segment = this.speechQueue.shift();
      if (!segment) continue;
      
      // Произносим текст сегмента, если он есть
      if (segment.text) {
        await this.speakSegment(segment.text, isRepetition);
      }
      
      // Делаем паузу
      if (segment.pauseAfter > 0) {
        await this.pause(segment.pauseAfter);
      }
    }
    
    this.isProcessingQueue = false;
    this.isSpeaking$.next(false);
  }

  /**
   * Произнесение одного сегмента
   */
  private speakSegment(text: string, isRepetition: boolean): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Настройки голоса
      utterance.rate = isRepetition 
        ? this.voiceSettings.meditativeRate 
        : this.voiceSettings.rate;
      utterance.pitch = this.voiceSettings.pitch;
      utterance.volume = this.voiceSettings.volume;
      utterance.lang = 'ru-RU';
      
      // Обработчики событий
      utterance.onend = () => {
        if (!isRepetition) {
          this.currentMainSpeech = null;
        }
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        if (!isRepetition) {
          this.currentMainSpeech = null;
        }
        resolve();
      };
      
      // Сохраняем ссылку на основную речь
      if (!isRepetition) {
        this.currentMainSpeech = utterance;
      }
      
      // Запускаем речь
      this.synth.speak(utterance);
    });
  }

  /**
   * Создание паузы
   */
  private pause(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  /**
   * Улучшенный метод запуска медитативных повторов
   */
  startRepetition(phrase: string, intervalMs: number = 5000): void {
    this.clearRepetitionOnly();
    this.isRepetitionActive = true;
    
    if (!phrase) return;
    
    // Функция для одного цикла повтора
    const speakCycle = async () => {
      if (!this.isRepetitionActive || this.currentMainSpeech) return;
      
      // Парсим фразу на сегменты
      const segments = this.parseTextIntoSegments(phrase, 'repetition');
      
      // Добавляем паузу в конце цикла
      if (segments.length > 0) {
        segments[segments.length - 1].pauseAfter = this.pauseConfig.betweenCycles;
        segments[segments.length - 1].type = 'cycle';
      }
      
      // Произносим все сегменты
      this.speechQueue = segments;
      await this.processSegmentQueue(true);
    };
    
    // Первый повтор
    speakCycle();
    
    // Последующие повторы
    this.repetitionInterval = setInterval(() => {
      speakCycle();
    }, intervalMs);
  }

  /**
   * Остановка повторов
   */
  stopRepetition(): void {
    this.isRepetitionActive = false;
    this.clearRepetitionOnly();
    this.speechQueue = [];
  }

  /**
   * Остановка всей речи
   */
  stopCurrentSpeech(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentMainSpeech = null;
    this.speechQueue = [];
    this.isProcessingQueue = false;
    this.isSpeaking$.next(false);
  }

  /**
   * Очистка только интервала повторов
   */
  private clearRepetitionOnly(): void {
    if (this.repetitionInterval) {
      clearInterval(this.repetitionInterval);
      this.repetitionInterval = null;
    }
  }

  /**
   * Инициализация обработчиков событий
   */
  private initializeSpeechHandlers(): void {
    // Обработка прерываний системой
    if ('speechSynthesis' in window) {
      // Восстановление после прерывания
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pause(100); // Небольшая пауза при скрытии вкладки
        }
      });
    }
  }

  /**
   * Обновление настроек голоса
   */
  updateVoiceSettings(settings: Partial<typeof this.voiceSettings>): void {
    this.voiceSettings = { ...this.voiceSettings, ...settings };
  }

  /**
   * Получение доступных голосов
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices().filter(voice => voice.lang.startsWith('ru'));
  }

  /**
   * Полная очистка сервиса
   */
  dispose(): void {
    this.stopCurrentSpeech();
    this.stopRepetition();
    this.speechQueue = [];
    this.isSpeaking$.next(false);
  }
}

Архитектурная рецензия
1. Generator-based подход - ОТЛИЧНОЕ решение ✅
Ваш выбор generator функций для медитативных практик - это элегантное и правильное решение по следующим причинам:
Преимущества:

Естественная последовательность: Generators идеально подходят для пошаговых процессов
Состояние между шагами: Автоматическое сохранение локальных переменных
Композиция через yield*: Прекрасно работает для переиспользуемых блоков
Читаемость кода: Практики выглядят как обычный императивный код

Альтернативы и почему generators лучше:

State Machine: больше boilerplate, менее гибкая
Command Pattern: сложнее для циклов и условий
Observable chains: теряется императивная читаемость

2. Решение навигации назад
Предложенное решение с снимками состояния - оптимальный компромисс:

Мемоизация шагов: Быстрая навигация вперед/назад
Пересоздание при необходимости: Гарантия корректности состояния
Гибридный подход: goBackOptimized() для UI, полное восстановление для сложных случаев

3. Архитектурные улучшения

/**
 * Декларативный DSL для описания медитативных фраз с паузами
 * Позволяет явно указывать паузы и дыхательные циклы
 */

// ============= DSL для медитативных фраз =============

export interface MeditativePhrase {
  segments: PhraseSegment[];
  defaultPauseDuration?: number;
  breathingPattern?: BreathingPattern;
}

export interface PhraseSegment {
  text: string;
  pause?: number | PauseType;
  emphasis?: 'soft' | 'normal' | 'strong';
  speed?: number; // множитель скорости: 0.5 = медленно, 1.5 = быстро
}

export type PauseType = 'short' | 'medium' | 'long' | 'breath' | 'cycle';

export interface BreathingPattern {
  inhale: number;  // длительность вдоха в мс
  hold: number;    // задержка дыхания
  exhale: number;  // длительность выдоха
  pause: number;   // пауза перед следующим циклом
}

/**
 * Построитель медитативных фраз с fluent API
 */
export class MeditativePhraseBuilder {
  private segments: PhraseSegment[] = [];
  private defaultPause = 1000;
  private breathingPattern?: BreathingPattern;
  
  static create(): MeditativePhraseBuilder {
    return new MeditativePhraseBuilder();
  }
  
  text(text: string, pause?: number | PauseType): this {
    this.segments.push({ text, pause });
    return this;
  }
  
  pause(duration: number | PauseType): this {
    this.segments.push({ text: '', pause: duration });
    return this;
  }
  
  breath(): this {
    this.segments.push({ text: '', pause: 'breath' });
    return this;
  }
  
  withBreathingPattern(pattern: BreathingPattern): this {
    this.breathingPattern = pattern;
    return this;
  }
  
  withDefaultPause(ms: number): this {
    this.defaultPause = ms;
    return this;
  }
  
  build(): MeditativePhrase {
    return {
      segments: this.segments,
      defaultPauseDuration: this.defaultPause,
      breathingPattern: this.breathingPattern
    };
  }
}

// Примеры использования DSL:
export const meditativePhrases = {
  selfCancellation: MeditativePhraseBuilder.create()
    .text('Мне не важно, решится ли {{problem}}, или нет.', 'medium')
    .text('Мне нужна только связь с Творцом.', 'long')
    .breath()
    .text('И я здесь только для того, чтобы с ним соединиться через эту проблему.')
    .withBreathingPattern({
      inhale: 3000,
      hold: 1000,
      exhale: 4000,
      pause: 1000
    })
    .build(),
    
  lightConductor: MeditativePhraseBuilder.create()
    .text('Творец,', 'short')
    .text('исправь их намерение из получения в отдачу,', 'medium')
    .text('приблизь их к себе', 'short')
    .text('и наполни их нехватки благом и наслаждением.', 'cycle')
    .build()
};

// ============= Улучшенная система блоков =============

/**
 * Декоратор для блоков практики с метаданными