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
  PracticeConfig 
} from '../../../core/models/practice-engine.types';

@Component({
  selector: 'app-practice-runner',
  templateUrl: './practice-runner.component.html',
  styleUrls: ['./practice-runner.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
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
        .subscribe(step => {
          this.handleStepChange(step);
        })
    );
    
    this.subscriptions.add(
      this.practiceEngine.isRunning.subscribe(running => {
        this.isRunning = running;
      })
    );
    
    this.subscriptions.add(
      this.practiceEngine.isFinished.subscribe(finished => {
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
    this.subscriptions.unsubscribe();
  }
  
  private async handleStepChange(step: PracticeStep | null): Promise<void> {
    if (!step) return;
    
    // Проверяем, действительно ли это новый шаг
    if (this.currentStepId === step.id) {
      console.log('Same step, skipping:', step.id);
      return;
    }
    
    console.log('Step changed from', this.currentStepId, 'to', step.id);
    this.currentStepId = step.id;
    this.currentStep = step;
    
    // Останавливаем предыдущую речь
    await this.stopCurrentSpeech();
    
    // Подготавливаем UI
    this.prepareStepUI(step);
    
    // Говорим новый шаг
    if (!this.showStartScreen) {
      await this.speakCurrentStep();
    }
  }

  private async stopCurrentSpeech(): Promise<void> {
    console.log('STOPPING ALL SPEECH IMMEDIATELY');
    
    // Устанавливаем флаг СРАЗУ
    this.isSpeaking = false;
    this.isRepetitionActive = false;
    
    // МГНОВЕННАЯ остановка всей речи
    this.speechService.stopSpeech();
    
    // Минимальная задержка только для стабильности
    await new Promise(resolve => setTimeout(resolve, 30));
  }
  
  /**
   * Начать практику
   */
  async startPractice(): Promise<void> {
    this.showStartScreen = false;
    this.practiceStarted.emit();
    
    await this.practiceEngine.startPractice(
      this.config.practiceFunction,
      this.initialContext
    );
    
    // После запуска практики озвучиваем первый шаг
    if (this.currentStep && this.isVoiceEnabled) {
      this.speakCurrentStep();
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

    // Переходим к указанному шагу
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
    const inputValue = this.getCurrentInputValue();
    const result = await this.practiceEngine.finishPractice(inputValue);
    this.practiceFinished.emit(result);
    
    // Выполняем onFinish callback, если есть
    if (this.config.onFinish) {
      await this.config.onFinish(this.practiceEngine.getContext(), result);
    }
    
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
    console.log('PREPARE STEP UI called for step:', step.id);
    
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
    
    // Устанавливаем состояние для шагов с повторами
    this.isRepetitionActive = !!(
      step.repeatablePhrase && 
      step.showToggleRepetition && 
      this.isVoiceEnabled && 
      !this.showStartScreen
    );
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
    
    try {
      console.log('Speaking step instruction for step:', stepId);
      
      // 1. Говорим основную инструкцию
      await this.speechService.speak(this.currentStep.instruction);
      
      // Проверяем, не изменился ли шаг пока мы говорили
      if (this.currentStepId !== stepId) {
        console.log('Step changed during speech, aborting repetition');
        return;
      }
      
      console.log('Main speech finished for step:', stepId);
      
      // 2. Небольшая пауза перед повторами
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 3. Запускаем повторы, если нужно и шаг не изменился
      if (this.currentStepId === stepId && 
          this.isRepetitionActive && 
          this.currentStep.repeatablePhrase) {
        console.log('Starting repetition for step:', stepId);
        this.speechService.startRepetition(
          this.currentStep.repeatablePhrase,
          5000 // интервал повтора
        );
      }
    } catch (error) {
      console.error('Error in speakCurrentStep:', error);
    } finally {
      this.isSpeaking = false;
    }
  }
  
  /**
   * Обработчик завершения практики
   */
  private onPracticeCompleted(): void {
    this.speechService.clearRepetition();
    this.isRepetitionActive = false;
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
    return this.currentStep?.isFinalStep === true || this.currentStep?.type === 'rating';
  }
  
  /**
   * Получить иконку для рейтинга
   */
  getRatingIcon(): string {
    if (this.userRating >= 8) return 'sentiment_very_satisfied';
    if (this.userRating >= 6) return 'sentiment_satisfied';
    if (this.userRating >= 4) return 'sentiment_neutral';
    return 'sentiment_dissatisfied';
  }

  /**
   * Получить CSS классы для цвета смайлика рейтинга (всегда голубой как primary кнопка)
   */
  getRatingIconClass(): string {
    return 'text-blue-500'; // Всегда голубой как primary кнопки
  }
  
  /**
   * Получить плейсхолдер для поля ввода
   */
  getInputPlaceholder(): string {
    return this.currentStep?.inputConfig?.placeholder || 'Введите ваш ответ...';
  }
}