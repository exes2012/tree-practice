// Новая архитектура практик на основе generator-функций

export interface PracticeStep {
  id: string;
  title: string;
  instruction: string;
  type: 'simple' | 'input' | 'rating' | 'repeat' | 'choice';
  
  // Для повторяемых фраз
  repeatablePhrase?: string;
  
  // Конфигурация ввода
  inputConfig?: {
    field: string;
    type: 'text' | 'textarea' | 'number' | 'radio' | 'choice';
    placeholder?: string;
    initialValue?: any;
    options?: { value: any; label: string }[];
    choices?: Array<{ text: string; value: string; nextStep?: string }>;
    min?: number;
    max?: number;
  };
  
  // Простые кнопки навигации - каждая знает куда ведет
  customButtons?: Array<{
    text: string;
    value: string;
    targetStepId: string; // ID шага куда переходить
    saveValue?: boolean; // сохранять ли value в контекст
  }>;
  
  // Конфигурация оценки
  ratingConfig?: {
    min: number;
    max: number;
    isFinal?: boolean;
  };
  
  // UI настройки
  buttonText?: string;
  isFinalStep?: boolean;
  showToggleRepetition?: boolean;
}

export interface PracticeContext {
  // Основные данные
  goalId?: string;
  goal?: any; // Goal интерфейс
  
  // Пользовательские данные
  userInputs: { [key: string]: any };
  
  // Методы для работы с данными
  get<T = any>(key: string): T | undefined;
  set(key: string, value: any): void;
  has(key: string): boolean;
}

// Тип для generator функций практик
export type PracticeFunction = (context: PracticeContext) => AsyncIterableIterator<PracticeStep>;

// Конфигурация практики
export interface PracticeConfig {
  id: string;
  title: string;
  description?: string;
  
  // Стартовый экран
  hasStartScreen?: boolean;
  startScreenContent?: {
    title: string;
    description: string;
    duration?: string;
    level?: string;
  };
  
  // Функция практики
  practiceFunction: PracticeFunction;
  
  // Действие после завершения
  onFinish?: (context: PracticeContext, result: any) => void | Promise<void>;
}

// Результат выполнения шага
export interface StepResult {
  stepId: string;
  userInput?: any;
  timestamp: Date;
}

// Результат всей практики
export interface PracticeResult {
  practiceId: string;
  context: PracticeContext;
  steps: StepResult[];
  finalResult: any;
  rating?: number;
  completedAt: Date;
}

// Класс для работы с контекстом
export class PracticeContextImpl implements PracticeContext {
  goalId?: string;
  goal?: any;
  userInputs: { [key: string]: any } = {};
  
  constructor(initialData: Partial<PracticeContext> = {}) {
    Object.assign(this, initialData);
  }
  
  get<T = any>(key: string): T | undefined {
    return this.userInputs[key] as T;
  }
  
  set(key: string, value: any): void {
    this.userInputs[key] = value;
  }
  
  has(key: string): boolean {
    return key in this.userInputs;
  }
  
  // Замена плейсхолдеров в тексте
  processText(text: string): string {
    let processed = text;
    
    // Заменяем {{goal.title}}
    if (this.goal?.title) {
      processed = processed.replace(/\{\{goal\.title\}\}/g, this.goal.title);
    }
    
    // Заменяем другие переменные из userInputs
    Object.entries(this.userInputs).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        processed = processed.replace(regex, String(value));
      }
    });
    
    return processed;
  }
}