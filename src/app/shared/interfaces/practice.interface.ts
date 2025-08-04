export interface PracticeStep {
  title: string;
  instruction: string;
  repeatablePhrase?: string;
  inputField?: string;
  initialValue?: string;
  buttonText?: string;
  showRating?: boolean;
  isFinalRating?: boolean;
  showToggleRepetition?: boolean;
  inputType?: 'text' | 'textarea' | 'radio' | 'number';
  options?: { value: string; label: string }[];
  isFinalStep?: boolean;
}

export interface PracticeConfig {
  title: string;
  description?: string;
  showTimer?: boolean;
  mainPracticeStepIndex?: number;
  stepDurationOptions?: number[];
  practiceDurationOptions?: number[];
  selectedStepDuration?: number;
  selectedPracticeDuration?: number;
}

export interface PracticeResult {
  rating: number;
  data?: any;
}

export interface PracticeNavigation {
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastStep: boolean;
  isFirstStep: boolean;
}
