
export type StepType = 'instruction' | 'input' | 'rating' | 'custom';

export interface PracticeStep {
  id: string; // Уникальный идентификатор шага
  title: string;
  instruction: string; // Основной текст/инструкция для шага
  type: StepType;
  repeatablePhrase?: string; // Фраза для повторения, если есть
  inputField?: string; // Для шагов типа 'input', куда сохранять значение
  // Другие возможные свойства:
  // - showTimer?: boolean;
  // - duration?: number;
  // - nextStepId?: string | ((context: PracticeContext) => string); // Для сложной логики переходов
}

export interface FinishAction {
  type: 'navigateTo' | 'custom';
  route?: string; // Маршрут для 'navigateTo', может содержать параметры, например /goals/:id
}

export interface Practice {
  id: string; // Уникальный идентификатор практики, например 'man-with-goal'
  title: string;
  description: string;
  hasStartScreen: boolean;
  startScreenContent?: {
    title: string;
    description: string;
  };
  steps: PracticeStep[];
  finishAction: FinishAction;
}

// Контекст выполнения практики, который может передаваться между шагами
export interface PracticeContext {
  [key: string]: any;
}
