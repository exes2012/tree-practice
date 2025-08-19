import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { PracticeEngineV2Service } from '../../../core/services/practice-engine-v2.service';
import { SpeechService } from '../../services/speech.service';
import {
  PracticeFunction,
  PracticeStep,
  PracticeContext,
  PracticeResult,
  PracticeConfig,
} from '../../../core/models/practice-engine.types';

@Component({
  selector: 'app-practice-runner',
  templateUrl: './practice-runner.component.html',
  
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PracticeRunnerComponent implements OnInit, OnDestroy {
  @Input() config!: PracticeConfig;
  @Input() initialContext: Partial<PracticeContext> = {};

  @Output() practiceFinished = new EventEmitter<PracticeResult>();
  @Output() practiceStarted = new EventEmitter<void>();

  // Состояние компонента
  currentStep: PracticeStep | null = null;
  isRunning = false;
  isFinished = false;
  showStartScreen = true;

  // UI состояние
  isVoiceEnabled = true;
  isRepetitionActive = true; // По умолчанию включен
  userInput: any = '';
  userRating = 5;

  // Дыхательное упражнение
  isBreathingActive = false;
  breathingState: 'stopped' | 'inhale' | 'hold' | 'exhale' | 'pause' = 'stopped';
  breathingPhaseTimer = 0;
  breathingCycles = 0;
  private breathingInterval: any;

  // Состояние речи и таймера
  private isSpeechCompleted = false;

  // Таймер практики
  private practiceStartTime: Date | null = null;
  private practiceDuration = 0; // в секундах
  private isOnFinishCalled = false; // флаг для предотвращения дублирования вызова onFinish

  // Автоматические таймеры
  isAutoTimerActive = false;
  autoTimerRemaining = 0;
  private autoTimerInterval: any;
  private breathingPhaseInterval: any;

  private isSpeaking = false; // Флаг для предотвращения множественных вызовов
  private currentStepId: string | null = null; // Для отслеживания изменения шага
  private subscriptions = new Subscription();

  constructor(
    private practiceEngine: PracticeEngineV2Service,
    private speechService: SpeechService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Подписываемся на изменения состояния движка с защитой от дублей
    this.subscriptions.add(
      this.practiceEngine.currentStep
        .pipe(
          // Фильтруем дублирующиеся эмиты
          distinctUntilChanged((prev, curr) => prev?.id === curr?.id),
          // Добавляем небольшую задержку для группировки быстрых изменений
          debounceTime(50)
        )
        .subscribe((step) => {
          this.handleStepChange(step);
        })
    );

    this.subscriptions.add(
      this.practiceEngine.isRunning.subscribe((running) => {
        this.isRunning = running;
      })
    );

    this.subscriptions.add(
      this.practiceEngine.isFinished.subscribe((finished) => {
        console.log('isFinished received:', finished, 'current step:', this.currentStep?.id);

        // Устанавливаем завершение только если это действительно конец
        if (finished && (this.currentStep?.isFinalStep || this.currentStep?.type === 'rating')) {
          console.log('Practice finished on final step');
          this.isFinished = finished;
          this.onPracticeCompleted();
        } else if (finished) {
          console.log('WARNING: Practice finished but not on final step - ignoring');
          // Не устанавливаем isFinished = true если мы не на финальном шаге
        } else {
          this.isFinished = finished;
        }
      })
    );

    // Показываем стартовый экран, если нужно
    if (!this.config.hasStartScreen) {
      this.startPractice();
    }
  }

  ngOnDestroy(): void {
    this.speechService.stopSpeech();
    this.stopBreathing(); // Останавливаем дыхательное упражнение
    this.stopAutoTimer(); // Останавливаем автоматический таймер
    this.subscriptions.unsubscribe();
  }

  private async handleStepChange(step: PracticeStep | null): Promise<void> {
    if (!step) return;

    // Проверяем, действительно ли это новый шаг
    if (this.currentStepId === step.id) {
      console.log('Same step, skipping:', step.id);
      return;
    }

    this.currentStepId = step.id;
    this.currentStep = step;
    this.isSpeechCompleted = false; // Сброс флага при смене шага

    // Останавливаем предыдущую речь, дыхание и автоматический таймер
    await this.stopCurrentSpeech();
    this.stopBreathing();
    this.stopAutoTimer();

    // Подготавливаем UI
    this.prepareStepUI(step);

    // Говорим новый шаг
    if (!this.showStartScreen) {
      // Ждем завершения речи перед запуском таймера
      await this.speakCurrentStepAndWait();
    } else if (step.autoTimer) {
      // Если показываем стартовый экран, но у шага есть таймер, запускаем его сразу
      this.startAutoTimer(step.autoTimer);
    }
  }

  private async stopCurrentSpeech(): Promise<void> {
    console.log('STOPPING ALL SPEECH IMMEDIATELY');

    // Устанавливаем флаг СРАЗУ
    this.isSpeaking = false;
    this.isRepetitionActive = false;
    this.isSpeechCompleted = false; // Сброс флага завершения речи

    // МГНОВЕННАЯ остановка всей речи
    this.speechService.stopSpeech();

    // Минимальная задержка только для стабильности
    await new Promise((resolve) => setTimeout(resolve, 30));
  }

  /**
   * Начать практику
   */
  async startPractice(): Promise<void> {
    this.showStartScreen = false;
    this.practiceStarted.emit();

    // Сбрасываем флаг onFinish при начале новой практики
    this.isOnFinishCalled = false;

    // Запускаем таймер практики
    this.practiceStartTime = new Date();
    this.practiceDuration = 0;

    await this.practiceEngine.startPractice(this.config.practiceFunction, this.initialContext);

    // После запуска практики озвучиваем первый шаг
    if (this.currentStep && this.isVoiceEnabled) {
      await this.speakCurrentStepAndWait();
    }
  }

  /**
   * Следующий шаг
   */
  async onNextClick(): Promise<void> {
    const inputValue = this.getCurrentInputValue();

    // Останавливаем текущую речь перед переходом
    await this.stopCurrentSpeech();

    // Переходим к следующему шагу
    await this.practiceEngine.nextStep(inputValue);

    // resetStepUI больше не нужен, так как prepareStepUI вызовется автоматически
  }

  /**
   * Назад (упрощенная версия)
   */
  async onBackClick(): Promise<void> {
    await this.practiceEngine.goBack();
  }

  /**
   * Выбор варианта ответа
   */
  async onChoiceSelected(value: string): Promise<void> {
    // Останавливаем текущую речь перед переходом
    await this.stopCurrentSpeech();

    // Переходим к следующему шагу с выбранным значением
    await this.practiceEngine.nextStep(value);
  }

  /**
   * Обработка кастомных кнопок навигации
   */
  async onCustomButtonClick(button: any): Promise<void> {
    // Останавливаем текущую речь перед переходом
    await this.stopCurrentSpeech();

    // Сохраняем значение в контекст если нужно
    if (button.saveValue) {
      const currentStep = this.currentStep;
      if (currentStep?.inputConfig?.field) {
        this.practiceEngine.getContext().set(currentStep.inputConfig.field, button.value);
      }
    }

    // Если текущий шаг финальный, завершаем практику
    if (this.currentStep?.isFinalStep) {
      // Предотвращаем дублирование вызова onFinish
      if (this.isOnFinishCalled) {
        console.log('onFinish already called, skipping duplicate call');
        return;
      }

      console.log('Final step - finishing practice with value:', button.value);
      const result = await this.practiceEngine.finishPractice(button.value);
      this.practiceFinished.emit(result);

      // НЕ вызываем onFinish здесь - он вызовется автоматически через onPracticeCompleted()
      // когда practiceEngine.finishPractice() установит isFinished = true
      return;
    }

    // Переходим к указанному шагу (если не финальный)
    await this.practiceEngine.goToStepById(button.targetStepId, button.value);
  }

  /**
   * Домой
   */
  onHomeClick(): void {
    this.speechService.clearRepetition();
    this.isRepetitionActive = false;

    // Полностью очищаем состояние движка
    this.practiceEngine.reset();

    this.router.navigate(['/']);
  }

  /**
   * Переключение голоса - МГНОВЕННОЕ
   */
  onVoiceToggle(): void {
    console.log('VOICE TOGGLE clicked - current state:', this.isVoiceEnabled);

    this.isVoiceEnabled = !this.isVoiceEnabled;

    if (!this.isVoiceEnabled) {
      // Отключение голоса - МГНОВЕННО останавливаем ВСЁ
      console.log('VOICE DISABLED - stopping all speech');
      this.isRepetitionActive = false;
      this.isSpeechCompleted = false; // Сброс флага завершения речи
      this.speechService.stopSpeech();
    } else {
      // Включение голоса - можем начать говорить текущий шаг
      console.log('VOICE ENABLED - can start speaking');
      if (this.currentStep && this.currentStep.instruction) {
        this.speakCurrentStep();
      }
    }
  }

  /**
   * Переключение повтора фразы
   */
  onRepetitionToggle(): void {
    if (this.speechService.getIsRepetitionActive()) {
      // Если повтор активен - останавливаем
      this.speechService.clearRepetition();
    } else {
      // Если повтор не активен - запускаем
      if (this.currentStep?.repeatablePhrase && this.isVoiceEnabled) {
        this.speechService.startRepetition(this.currentStep.repeatablePhrase);
      }
    }

    // Синхронизируем UI состояние с реальным состоянием сервиса
    this.syncRepetitionState();
  }

  /**
   * Синхронизация состояния повтора между UI и сервисом
   */
  private syncRepetitionState(): void {
    this.isRepetitionActive = this.speechService.getIsRepetitionActive();
  }

  /**
   * Завершить практику
   */
  async onFinishClick(): Promise<void> {
    // Предотвращаем дублирование вызова onFinish
    if (this.isOnFinishCalled) {
      console.log('onFinish already called, skipping duplicate call');
      this.onHomeClick();
      return;
    }

    const inputValue = this.getCurrentInputValue();
    const result = await this.practiceEngine.finishPractice(inputValue);
    this.practiceFinished.emit(result);

    // НЕ вызываем onFinish здесь - он вызовется автоматически через onPracticeCompleted()
    // когда practiceEngine.finishPractice() установит isFinished = true

    // Переходим на главную страницу после завершения практики
    this.onHomeClick();
  }

  /**
   * Получить текущее значение ввода пользователя
   */
  private getCurrentInputValue(): any {
    if (!this.currentStep) return undefined;

    switch (this.currentStep.type) {
      case 'input':
        return this.userInput;
      case 'rating':
        return this.userRating;
      default:
        return undefined;
    }
  }

  private prepareStepUI(step: PracticeStep): void {
    // Инициализация полей ввода
    this.userInput = '';
    this.userRating = 5;

    if (step.inputConfig) {
      const context = this.practiceEngine.getContext();
      const existingValue = context.get(step.inputConfig.field);

      if (existingValue !== undefined) {
        if (step.type === 'rating') {
          this.userRating = existingValue;
        } else {
          this.userInput = existingValue;
        }
      } else if (step.inputConfig.initialValue !== undefined) {
        if (step.type === 'rating') {
          this.userRating = step.inputConfig.initialValue;
        } else {
          this.userInput = step.inputConfig.initialValue;
        }
      } else {
        if (step.type === 'rating') {
          this.userRating = step.ratingConfig?.min || 1;
        } else {
          this.userInput = '';
        }
      }
    }

    // Для шагов с повторяемыми фразами - устанавливаем в true по умолчанию
    // Это позволит автоматически запускать повторы после основного текста
    if (step.repeatablePhrase && step.showToggleRepetition) {
      this.isRepetitionActive = true;
    } else {
      this.isRepetitionActive = false;
    }
  }

  /**
   * Сбросить UI после шага
   */
  private resetStepUI(): void {
    this.speechService.clearRepetition();
    // НЕ сбрасываем isRepetitionActive - оставляем включенным по умолчанию
    this.userInput = '';
    this.userRating = 5;
  }

  private async speakCurrentStep(): Promise<void> {
    if (!this.isVoiceEnabled || !this.currentStep) return;

    // Предотвращаем множественные вызовы
    if (this.isSpeaking) {
      console.log('Already speaking, skipping...');
      return;
    }

    const stepId = this.currentStep.id;
    this.isSpeaking = true;
    this.isSpeechCompleted = false; // Сброс флага завершения речи

    try {
      // 1. Говорим основную инструкцию
      await this.speechService.speak(this.currentStep.instruction);

      // Проверяем, не изменился ли шаг пока мы говорили
      if (this.currentStepId !== stepId) {
        console.log('Step changed during speech, aborting repetition');
        this.isSpeechCompleted = false;
        return;
      }

      this.isSpeechCompleted = true; // Устанавливаем флаг завершения речи

      // 2. Небольшая пауза перед повторами
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 3. Запускаем повторы автоматически, если у шага есть повторяемая фраза
      if (
        this.currentStepId === stepId &&
        this.currentStep.repeatablePhrase &&
        this.currentStep.showToggleRepetition &&
        this.isVoiceEnabled
      ) {
        this.speechService.startRepetition(
          this.currentStep.repeatablePhrase,
          5000 // интервал повтора
        );
        // Синхронизируем UI состояние
        this.syncRepetitionState();
      }
    } catch (error) {
      console.error('Error in speakCurrentStep:', error);
      this.isSpeechCompleted = false;
    } finally {
      this.isSpeaking = false;
    }
  }

  /**
   * Сказать текущий шаг и дождаться полного завершения речи и повторов
   */
  private async speakCurrentStepAndWait(): Promise<void> {
    if (!this.isVoiceEnabled || !this.currentStep) return Promise.resolve();

    const stepId = this.currentStep.id;
    const originalIsRepetitionActive = this.isRepetitionActive;

    try {
      // Говорим основную инструкцию
      await this.speechService.speak(this.currentStep.instruction);

      // Проверяем, не изменился ли шаг пока мы говорили
      if (this.currentStepId !== stepId) {
        console.log('Step changed during main speech, aborting');
        this.isSpeechCompleted = false;
        return;
      }

      // Устанавливаем флаг завершения речи
      this.isSpeechCompleted = true;

      // Запускаем повторы автоматически, если нужно
      if (
        this.currentStep.repeatablePhrase &&
        this.currentStep.showToggleRepetition &&
        this.isVoiceEnabled &&
        this.currentStepId === stepId
      ) {
        this.speechService.startRepetition(
          this.currentStep.repeatablePhrase,
          5000 // интервал повтора
        );
        this.syncRepetitionState();

        // Ждем немного, чтобы первый повтор успел сыграть
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // Запускаем таймер если он есть и шаг не изменился
      if (this.currentStep.autoTimer && this.currentStepId === stepId) {
        this.startAutoTimer(this.currentStep.autoTimer);
      }
    } catch (error) {
      console.error('Error in speakCurrentStepAndWait:', error);
      this.isSpeechCompleted = false;
    }
  }

  /**
   * Обработчик завершения практики
   */
  private onPracticeCompleted(): void {
    // Предотвращаем дублирование вызова onFinish
    if (this.isOnFinishCalled) {
      console.log('onFinish already called, skipping duplicate call');
      return;
    }

    this.speechService.clearRepetition();
    this.isRepetitionActive = false;

    // Вычисляем продолжительность практики
    if (this.practiceStartTime) {
      const endTime = new Date();
      this.practiceDuration = Math.floor(
        (endTime.getTime() - this.practiceStartTime.getTime()) / 1000
      );
      console.log('Practice duration:', this.practiceDuration, 'seconds');
    }

    // Выполняем onFinish callback, если есть
    if (this.config.onFinish) {
      this.isOnFinishCalled = true; // устанавливаем флаг перед вызовом
      const context = this.practiceEngine.getContext();
      // Получаем финальный результат из контекста
      const finalResult = {
        ...context.getAll(), // Получаем все данные из контекста
        duration: this.practiceDuration,
      };

      this.config.onFinish(context, finalResult);
    }
  }

  /**
   * Проверки для UI
   */
  get canGoNext(): boolean {
    return this.currentStep !== null && !this.currentStep.isFinalStep;
  }

  get canGoBack(): boolean {
    return this.practiceEngine.canGoBack();
  }

  get showFinishButton(): boolean {
    if (!this.currentStep) return false;
    if (this.currentStep.isFinalStep === true) return true;
    if (this.currentStep.type === 'rating') return this.currentStep.ratingConfig?.isFinal === true;
    return false;
  }

  /**
   * Получить иконку для рейтинга
   */
  getRatingIcon(): string {
    if (this.userRating >= 8) return 'sentiment_very_satisfied';
    if (this.userRating >= 6) return 'sentiment_satisfied';
    if (this.userRating >= 4) return 'sentiment_neutral';
    if (this.userRating >= 2) return 'sentiment_dissatisfied';
    return 'sentiment_very_dissatisfied';
  }

  /**
   * Получить CSS классы для цвета смайлика рейтинга (теперь используется прямой стиль)
   */
  getRatingIconClass(): string {
    return ''; // Не используется, цвет задается через style
  }

  /**
   * Получить плейсхолдер для поля ввода
   */
  getInputPlaceholder(): string {
    return this.currentStep?.inputConfig?.placeholder || 'Введите ваш ответ...';
  }

  // ======================
  // ДЫХАТЕЛЬНОЕ УПРАЖНЕНИЕ
  // ======================

  /**
   * Начать дыхательное упражнение
   */
  startBreathing(): void {
    if (!this.currentStep?.breathingConfig) return;

    this.isBreathingActive = true;
    this.breathingCycles = 0;
    this.startBreathingCycle();
  }

  /**
   * Приостановить дыхательное упражнение
   */
  pauseBreathing(): void {
    this.isBreathingActive = false;
    this.breathingState = 'stopped';
    this.clearBreathingIntervals();
  }

  /**
   * Остановить дыхательное упражнение
   */
  stopBreathing(): void {
    this.isBreathingActive = false;
    this.breathingState = 'stopped';
    this.breathingCycles = 0;
    this.breathingPhaseTimer = 0;
    this.clearBreathingIntervals();
  }

  /**
   * Начать цикл дыхания
   */
  private startBreathingCycle(): void {
    if (!this.isBreathingActive || !this.currentStep?.breathingConfig) return;

    const config = this.currentStep.breathingConfig;

    // Проверяем, не достигли ли мы максимального количества циклов
    if (config.cycles && this.breathingCycles >= config.cycles) {
      this.stopBreathing();
      return;
    }

    this.breathingCycles++;
    this.startInhale();
  }

  /**
   * Начать фазу вдоха
   */
  private startInhale(): void {
    if (!this.currentStep?.breathingConfig) return;

    this.breathingState = 'inhale';
    this.breathingPhaseTimer = this.currentStep.breathingConfig.inhale;
    this.speak('Вдох');
    this.startPhaseTimer(() => this.startHold());
  }

  /**
   * Начать фазу задержки
   */
  private startHold(): void {
    if (!this.currentStep?.breathingConfig) return;

    this.breathingState = 'hold';
    this.breathingPhaseTimer = this.currentStep.breathingConfig.hold;
    this.speak('Задержка');
    this.startPhaseTimer(() => this.startExhale());
  }

  /**
   * Начать фазу выдоха
   */
  private startExhale(): void {
    if (!this.currentStep?.breathingConfig) return;

    this.breathingState = 'exhale';
    this.breathingPhaseTimer = this.currentStep.breathingConfig.exhale;
    this.speak('Выдох');
    this.startPhaseTimer(() => this.startPause());
  }

  /**
   * Начать фазу паузы
   */
  private startPause(): void {
    if (!this.currentStep?.breathingConfig) return;

    this.breathingState = 'pause';
    this.breathingPhaseTimer = this.currentStep.breathingConfig.pause;
    this.speak('Пауза');
    this.startPhaseTimer(() => this.startBreathingCycle());
  }

  /**
   * Запустить таймер для фазы
   */
  private startPhaseTimer(nextPhase: () => void): void {
    this.breathingPhaseInterval = setInterval(() => {
      this.breathingPhaseTimer--;
      if (this.breathingPhaseTimer <= 0) {
        clearInterval(this.breathingPhaseInterval);
        if (this.isBreathingActive) {
          nextPhase();
        }
      }
    }, 1000);
  }

  /**
   * Очистить все интервалы дыхания
   */
  private clearBreathingIntervals(): void {
    if (this.breathingInterval) {
      clearInterval(this.breathingInterval);
    }
    if (this.breathingPhaseInterval) {
      clearInterval(this.breathingPhaseInterval);
    }
  }

  /**
   * Получить текст текущей фазы дыхания
   */
  getBreathingPhaseText(): string {
    switch (this.breathingState) {
      case 'inhale':
        return 'ח Вдох';
      case 'hold':
        return 'ד Задержка';
      case 'exhale':
        return 'ו Выдох';
      case 'pause':
        return 'ה Пауза';
      default:
        return 'Готов';
    }
  }

  /**
   * Получить еврейскую букву для текущей фазы дыхания
   */
  getBreathingHebrewLetter(): string {
    switch (this.breathingState) {
      case 'inhale':
        return 'ח';
      case 'hold':
        return 'ד';
      case 'exhale':
        return 'ו';
      case 'pause':
        return 'ה';
      default:
        return '';
    }
  }

  /**
   * Получить русское слово для текущей фазы дыхания
   */
  getBreathingRussianWord(): string {
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
        return 'Готов';
    }
  }

  /**
   * Получить инструкцию для текущей фазы
   */
  getBreathingPhaseInstruction(): string {
    switch (this.breathingState) {
      case 'inhale':
        return 'Медленно вдыхайте';
      case 'hold':
        return 'Задержите дыхание';
      case 'exhale':
        return 'Медленно выдыхайте';
      case 'pause':
        return 'Расслабьтесь';
      default:
        return 'Нажмите "Начать дыхание"';
    }
  }

  /**
   * Получить цвет для текущей фазы
   */
  getBreathingPhaseColor(): string {
    switch (this.breathingState) {
      case 'inhale':
        return 'text-green-600 dark:text-green-400';
      case 'hold':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'exhale':
        return 'text-blue-600 dark:text-blue-400';
      case 'pause':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  }

  /**
   * Получить прогресс дыхательного упражнения в процентах
   */
  getBreathingProgress(): number {
    if (!this.currentStep?.breathingConfig?.cycles) return 0;
    return (this.breathingCycles / this.currentStep.breathingConfig.cycles) * 100;
  }

  /**
   * Голосовые команды для дыхания
   */
  private speak(text: string): void {
    if (this.isVoiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.8;
      utterance.volume = 0.7;
      window.speechSynthesis.speak(utterance);
    }
  }

  /**
   * Получить CSS классы для еврейского текста
   */
  getHebrewTextClasses(): string {
    if (!this.currentStep?.hebrewDisplay) return '';

    const { size, color } = this.currentStep.hebrewDisplay;

    let classes = 'font-bold leading-none ';

    // Размер
    switch (size) {
      case 'small':
        classes += 'text-3xl ';
        break;
      case 'medium':
        classes += 'text-5xl ';
        break;
      case 'large':
        classes += 'text-7xl ';
        break;
      case 'extra-large':
        classes += 'text-8xl ';
        break;
      default:
        classes += 'text-7xl ';
    }

    // Цвет
    classes += color || 'text-blue-600 dark:text-blue-400';

    return classes;
  }

  /**
   * Получить CSS классы для кастомных кнопок
   */
  getCustomButtonClasses(button: any): string {
    switch (button.value) {
      case 'set_as_challenge':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'go_home':
        return 'bg-gray-600 hover:bg-gray-700';
      case 'yes':
        return 'bg-green-600 hover:bg-green-700';
      case 'no':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  }

  /**
   * Получить иконку для кастомных кнопок
   */
  getCustomButtonIcon(button: any): string {
    switch (button.value) {
      case 'set_as_challenge':
        return 'psychology';
      case 'go_home':
        return 'home';
      case 'yes':
        return 'check';
      case 'no':
        return 'close';
      // Иконки для выбора потоков в small-state практиках
      case 'creator':
        return 'auto_awesome';
      case 'self':
        return 'person';
      case 'others':
        return 'groups';
      default:
        return '';
    }
  }

  // === АВТОМАТИЧЕСКИЕ ТАЙМЕРЫ ===

  /**
   * Запустить автоматический таймер
   */
  private startAutoTimer(config: {
    duration: number;
    autoAdvance: boolean;
    showCountdown?: boolean;
  }): void {
    console.log('Starting auto timer with duration:', config.duration);

    // Сохраняем ID текущего шага для проверки
    const stepIdAtStart = this.currentStepId;

    // Если таймер уже активен, не запускаем новый
    if (this.isAutoTimerActive) {
      console.log('Auto timer already active, skipping');
      return;
    }

    this.stopAutoTimer(); // Останавливаем предыдущий таймер

    this.isAutoTimerActive = true;
    this.autoTimerRemaining = config.duration;

    this.autoTimerInterval = setInterval(() => {
      // Проверяем, не изменился ли шаг во время работы таймера
      if (this.currentStepId !== stepIdAtStart) {
        console.log('Step changed during timer, stopping timer');
        this.stopAutoTimer();
        return;
      }

      this.autoTimerRemaining--;

      if (this.autoTimerRemaining <= 0) {
        this.stopAutoTimer();

        // Проверяем еще раз, что шаг не изменился
        if (this.currentStepId === stepIdAtStart) {
          // Автоматически переходим к следующему шагу, если настроено
          if (config.autoAdvance) {
            this.onNextClick();
          }
        }
      }
    }, 1000);
  }

  /**
   * Остановить автоматический таймер
   */
  private stopAutoTimer(): void {
    if (this.autoTimerInterval) {
      clearInterval(this.autoTimerInterval);
      this.autoTimerInterval = null;
    }
    this.isAutoTimerActive = false;
    this.autoTimerRemaining = 0;
  }

  /**
   * Получить отформатированное время для автоматического таймера
   */
  getAutoTimerDisplay(): string {
    const minutes = Math.floor(this.autoTimerRemaining / 60);
    const seconds = this.autoTimerRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
