import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { 
  PracticeFunction, 
  PracticeStep, 
  PracticeContext, 
  PracticeContextImpl,
  StepResult,
  PracticeResult
} from '../models/practice-engine.types';

@Injectable({
  providedIn: 'root'
})

export class PracticeEngineV2Service {
  // Текущее состояние
  private currentIterator: AsyncIterableIterator<PracticeStep> | null = null;
  private context: PracticeContextImpl = new PracticeContextImpl();
  private stepHistory: StepResult[] = [];

  // Для навигации - новый подход
  private allSteps: PracticeStep[] = []; // Все шаги практики
  private currentStepIndex: number = -1;
  private stepSnapshots: Array<{
    step: PracticeStep;
    contextSnapshot: { [key: string]: any }
  }> = [];

  // Reactive state
  private currentStep$ = new BehaviorSubject<PracticeStep | null>(null);
  private isRunning$ = new BehaviorSubject<boolean>(false);
  private isFinished$ = new BehaviorSubject<boolean>(false);
  
  // Public observables
  currentStep = this.currentStep$.asObservable();
  isRunning = this.isRunning$.asObservable();
  isFinished = this.isFinished$.asObservable();
  
  constructor() {}
  
  /**
   * Запуск практики
   */
  async startPractice(
    practiceFunction: PracticeFunction,
    initialContext: Partial<PracticeContext> = {}
  ): Promise<void> {
    // Инициализация
    this.context = new PracticeContextImpl(initialContext);
    this.stepHistory = [];
    this.currentStepIndex = -1;
    this.stepSnapshots = [];
    this.allSteps = [];
    
    // Предварительно собираем ВСЕ шаги практики
    await this.collectAllSteps(practiceFunction);
    
    this.isRunning$.next(true);
    this.isFinished$.next(false);

    // Показываем первый шаг
    if (this.allSteps.length > 0) {
      this.currentStepIndex = 0;
      const firstStep = this.processStep(this.allSteps[0]);
      this.currentStep$.next(firstStep);
    }
  }

  /**
   * Собираем все шаги практики заранее
   */
  private async collectAllSteps(practiceFunction: PracticeFunction): Promise<void> {
    const tempContext = new PracticeContextImpl(this.context.userInputs);
    const iterator = practiceFunction(tempContext);
    
    while (true) {
      const result = await iterator.next();
      if (result.done) break;
      
      this.allSteps.push(result.value);
    }
    
    console.log(`Collected ${this.allSteps.length} steps for practice`);
  }
  
  /**
   * Переход к следующему шагу (стандартная навигация)
   */
  async nextStep(userInput?: any): Promise<void> {
    const currentStep = this.currentStep$.value;
    if (currentStep) {
      // Сохраняем результат текущего шага
      this.saveStepResult(currentStep, userInput);

      // Сохраняем данные в контекст, если есть поле
      if (currentStep.inputConfig?.field && userInput !== undefined) {
        this.context.set(currentStep.inputConfig.field, userInput);
      }
    }

    // Переходим к следующему шагу в массиве
    const nextIndex = this.currentStepIndex + 1;
    
    if (nextIndex >= this.allSteps.length) {
      // Практика завершена
      await this.finishPractice(userInput);
      return;
    }

    // Показываем следующий шаг
    this.currentStepIndex = nextIndex;
    const nextStep = this.processStep(this.allSteps[nextIndex]);
    
    // Сохраняем снимок
    this.stepSnapshots[this.currentStepIndex] = {
      step: nextStep,
      contextSnapshot: { ...this.context.userInputs }
    };

    this.currentStep$.next(nextStep);
  }

  /**
   * Переход к конкретному шагу по ID (простой и безопасный)
   */
  async goToStepById(targetStepId: string, userInput?: any): Promise<void> {
    const currentStep = this.currentStep$.value;
    if (currentStep) {
      // Сохраняем результат текущего шага
      this.saveStepResult(currentStep, userInput);

      // Сохраняем данные в контекст, если есть поле
      if (currentStep.inputConfig?.field && userInput !== undefined) {
        this.context.set(currentStep.inputConfig.field, userInput);
      }
    }

    // Сохраняем выбор пользователя
    this.context.set('lastChoice', userInput);

    // Ищем нужный шаг в заранее собранном массиве
    const targetIndex = this.allSteps.findIndex(step => step.id === targetStepId);
    
    if (targetIndex === -1) {
      console.error(`Step with ID "${targetStepId}" not found`);
      return;
    }

    // Просто переключаемся на нужный шаг
    this.currentStepIndex = targetIndex;
    const targetStep = this.processStep(this.allSteps[targetIndex]);
    
    // Сохраняем снимок
    this.stepSnapshots[this.currentStepIndex] = {
      step: targetStep,
      contextSnapshot: { ...this.context.userInputs }
    };

    // Показываем шаг
    this.currentStep$.next(targetStep);
  }
  
  /**
   * Завершение практики
   */
  async finishPractice(finalResult?: any): Promise<PracticeResult> {
    const currentStep = this.currentStep$.getValue();
    
    // Если передан финальный рейтинг и текущий шаг имеет правильное поле, сохраняем его
    if (finalResult !== undefined && currentStep?.inputConfig?.field === 'practice-final-rating') {
      this.context.set('practice-final-rating', finalResult);
    }
    
    // Ищем стандартный финальный рейтинг практики
    const rating = this.context.get('practice-final-rating');
    
    const result: PracticeResult = {
      practiceId: 'current', // TODO: получать из конфигурации
      context: this.context,
      steps: this.stepHistory,
      finalResult: finalResult || this.context.userInputs,
      rating,
      completedAt: new Date()
    };
    
    this.isRunning$.next(false);
    this.isFinished$.next(true);
    this.currentStep$.next(null);
    
    return result;
  }
  
  /**
   * Получение текущего контекста
   */
  getContext(): PracticeContextImpl {
    return this.context;
  }
  
  /**
   * Получение текущего шага
   */
  getCurrentStep(): PracticeStep | null {
    return this.currentStep$.value;
  }
  
  /**
   * Проверка, может ли пользователь вернуться назад
   */
  canGoBack(): boolean {
    return this.currentStepIndex > 0;
  }
  
  /**
   * Полная очистка состояния движка
   */
  reset(): void {
    this.currentIterator = null;
    this.context = new PracticeContextImpl();
    this.stepHistory = [];
    this.currentStepIndex = -1;
    this.stepSnapshots = [];
    this.allSteps = [];

    this.currentStep$.next(null);
    this.isRunning$.next(false);
    this.isFinished$.next(false);
  }
  
  /**
   * Возврат к предыдущему шагу
   */
  async goBack(): Promise<void> {
    if (this.currentStepIndex <= 0) {
      console.log('Cannot go back - already at first step');
      return;
    }

    // Переходим к предыдущему шагу в массиве
    this.currentStepIndex--;
    const prevStep = this.processStep(this.allSteps[this.currentStepIndex]);

    console.log('Going back to step:', prevStep.title);

    // Восстанавливаем снимок если есть
    if (this.stepSnapshots[this.currentStepIndex]) {
      this.context.userInputs = { ...this.stepSnapshots[this.currentStepIndex].contextSnapshot };
    }

    this.currentStep$.next(prevStep);

    // Удаляем последний результат из истории, если он есть
    if (this.stepHistory.length > this.currentStepIndex + 1) {
      this.stepHistory.pop();
    }
  }
  
  
  /**
   * Обработка шага - замена плейсхолдеров
   */
  private processStep(step: PracticeStep): PracticeStep {
    return {
      ...step,
      instruction: this.context.processText(step.instruction),
      repeatablePhrase: step.repeatablePhrase 
        ? this.context.processText(step.repeatablePhrase) 
        : undefined
    };
  }
  
  /**
   * Сохранение результата шага
   */
  private saveStepResult(step: PracticeStep, userInput?: any): void {
    this.stepHistory.push({
      stepId: step.id,
      userInput,
      timestamp: new Date()
    });
  }
}