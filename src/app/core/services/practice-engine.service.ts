
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Practice, PracticeStep, PracticeContext } from '../models/practice.model';
import { Goal, GoalService } from './goal.service'; // Предполагаем, что GoalService существует
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

const PRACTICES_DEFINITIONS: Practice[] = [
  {
    id: 'identification-practice',
    title: 'Выявление установки',
    description: 'Практика для выявления и работы с установками, связанными с целью.',
    hasStartScreen: true,
    startScreenContent: {
        title: 'Выявление установки',
        description: 'Эта практика поможет вам выявить ограничивающие установки, связанные с вашей целью, и начать работу по их трансформации.'
    },
    steps: [
        { id: 'step1', title: 'Шаг 1: Формулировка', instruction: 'Сформулируй свою цель: "{{goal.title}}".', type: 'instruction' },
        { id: 'step2', title: 'Шаг 2: Ощущение', instruction: 'Почувствуй пространство, себя, свое тело.', type: 'instruction' },
        { id: 'step3', title: 'Шаг 3: Самоотмена', instruction: 'Повторяй до состояния уменьшения важности и самоотмены:', type: 'instruction', repeatablePhrase: 'Мне не важно, будет ли достигнута "{{goal.title}}". Мне нужна только связь с Творцом. И я здесь только для того, чтобы соединиться с Ним через эту цель.' },
        { id: 'step4', title: 'Шаг 4: Выявление установки', instruction: 'Какая мысль или чувство возникает, когда ты думаешь о цели? Это и есть твоя установка.', type: 'input', inputField: 'userBelief' },
        { id: 'step5', title: 'Шаг 5: Оценка', instruction: 'Оцените проработку от 1 до 10.', type: 'rating' }
    ],
    finishAction: { type: 'navigateTo', route: '/goals/:id' }
  },
  {
    id: 'man-with-goal-practice',
    title: 'Подъем МАН с целью',
    description: 'Практика подъема МАН для реализации цели в духовном мире.',
    hasStartScreen: true,
    startScreenContent: {
        title: 'Подъем МАН с целью',
        description: 'Эта практика предназначена для работы с целью через подъем МАН (женских вод) – просьбы к Творцу о наполнении.'
    },
    steps: [
        { id: 'step1', title: 'Шаг 1: Ощущение', instruction: 'Почувствуй пространство, себя, свое тело.', type: 'instruction' },
        { id: 'step2', title: 'Шаг 2: Определение цели', instruction: 'Цель: "{{goal.title}}".', type: 'instruction' },
        { id: 'step3', title: 'Шаг 3: Локализация чувств', instruction: 'Представьте, что вы достигли цели. Найди, где это чувство ощущается.', type: 'instruction' },
        { id: 'step4', title: 'Шаг 4: Самоотмена', instruction: 'Повторяй до состояния уменьшения важности и самоотмены:', type: 'instruction', repeatablePhrase: 'Мне не важно, будет ли достигнута "{{goal.title}}". Мне нужна только связь с Творцом.' },
        { id: 'step5', title: 'Шаг 5: Найдите других', instruction: 'Повторяй:', type: 'instruction', repeatablePhrase: 'Все души в общей системе, которые страдают от недостижения этой цели, отпечатаны во мне.' },
        { id: 'step6', title: 'Шаг 6: Проводник света', instruction: 'Повторяй:', type: 'instruction', repeatablePhrase: 'Творец, исправь их сосуд и заполни их светом. Дай "{{goal.title}}" им, а не мне.' },
        { id: 'step7', title: 'Шаг 7: Соединение', instruction: 'Повторяй:', type: 'instruction', repeatablePhrase: 'Все, что существует, включая эту цель - и есть Творец.' },
        { id: 'step8', title: 'Шаг 8: Оценка', instruction: 'Оцените проработку от 1 до 10.', type: 'rating' }
    ],
    finishAction: { type: 'navigateTo', route: '/goals/:id' }
  },
  {
    id: 'alignment-practice',
    title: 'Сонастройка цели с Творцом',
    description: 'Практика для сонастройки вашей цели с волей Творца.',
    hasStartScreen: true,
    startScreenContent: {
        title: 'Сонастройка цели с Творцом',
        description: 'Эта практика поможет вам проверить, насколько ваша цель соответствует духовному пути, и сонастроить ее с высшей волей.'
    },
    steps: [
        { id: 'step1', title: 'Шаг 1: Формулировка', instruction: 'Моя цель: "{{goal.title}}".', type: 'instruction' },
        { id: 'step2', title: 'Шаг 2: Ощущение Творца', instruction: 'Почувствуй Творца как свойство отдачи и любви.', type: 'instruction' },
        { id: 'step3', title: 'Шаг 3: Сравнение', instruction: 'Сравни ощущение от цели с ощущением от Творца. Есть ли между ними сходство?', type: 'instruction' },
        { id: 'step4', title: 'Шаг 4: Просьба о сонастройке', instruction: 'Повторяй:', type: 'instruction', repeatablePhrase: 'Творец, сонастрой мою цель с Тобой. Покажи мне, как через эту цель я могу прийти к большему подобию Тебе.' },
        { id: 'step5', title: 'Шаг 5: Оценка', instruction: 'Оцените проработку от 1 до 10.', type: 'rating' }
    ],
    finishAction: { type: 'navigateTo', route: '/goals/:id' }
  }
];

@Injectable({
  providedIn: 'root'
})
export class PracticeEngineService {

  private currentPractice: Practice | null = null;
  private goal: Goal | null = null;
  private context: PracticeContext = {};

  private currentStepIndex = new BehaviorSubject<number>(-1); // -1 означает, что практика не начата (на стартовом экране)
  currentStepIndex$ = this.currentStepIndex.asObservable();

  private currentStep = new BehaviorSubject<PracticeStep | null>(null);
  currentStep$ = this.currentStep.asObservable();

  private isPracticeFinished = new BehaviorSubject<boolean>(false);
  isPracticeFinished$ = this.isPracticeFinished.asObservable();

  constructor(private goalService: GoalService, private router: Router) { }

  startPractice(practiceId: string, goalId: string): void {
    this.currentPractice = PRACTICES_DEFINITIONS.find(p => p.id === practiceId) || null;
    this.goal = this.goalService.getGoalById(goalId) || null;

    if (!this.currentPractice || !this.goal) {
      console.error('Practice or Goal not found!');
      return;
    }

    this.context = { goalId: goalId };
    this.isPracticeFinished.next(false);

    if (this.currentPractice.hasStartScreen) {
      this.currentStepIndex.next(-1);
      this.currentStep.next(null); // На стартовом экране нет текущего шага
    } else {
      this.currentStepIndex.next(0);
      this.updateCurrentStep();
    }
  }

  nextStep(inputValue?: any): void {
    if (!this.currentPractice) return;

    const currentStep = this.getCurrentStep();
    if (currentStep && currentStep.type === 'input' && currentStep.inputField) {
        this.context[currentStep.inputField] = inputValue;
    }

    const nextIndex = this.currentStepIndex.value + 1;
    if (nextIndex < this.currentPractice.steps.length) {
      this.currentStepIndex.next(nextIndex);
      this.updateCurrentStep();
    } else {
      this.finishPractice();
    }
  }

  previousStep(): void {
    if (!this.currentPractice) return;

    const prevIndex = this.currentStepIndex.value - 1;
    if (prevIndex >= -1) { // -1 для возврата на стартовый экран
      this.currentStepIndex.next(prevIndex);
      this.updateCurrentStep();
    }
  }

  finishPractice(rating?: number): void {
    if (!this.currentPractice || !this.goal) return;

    if (rating) {
        this.context['userRating'] = rating;
    }

    // Сохранение данных практики
    const newPracticeRecord = {
        id: uuidv4(),
        type: this.currentPractice.title,
        date: new Date().toISOString().split('T')[0],
        formulation: this.goal.title, // Добавляем недостающее поле
        ...this.context
    };
    this.goalService.addPracticeToGoal(this.goal.id, newPracticeRecord);

    this.isPracticeFinished.next(true);

    // Выполнение действия после завершения
    const action = this.currentPractice.finishAction;
    if (action.type === 'navigateTo' && action.route) {
        const finalRoute = action.route.replace(':id', this.goal.id);
        this.router.navigate([finalRoute]);
    }
  }

  getCurrentPractice(): Practice | null {
    return this.currentPractice;
  }

  private updateCurrentStep(): void {
    if (!this.currentPractice) return;

    const index = this.currentStepIndex.value;
    if (index >= 0 && index < this.currentPractice.steps.length) {
        let step = { ...this.currentPractice.steps[index] };
        // Замена плейсхолдеров в тексте инструкции
        if (this.goal) {
            step.instruction = step.instruction.replace(/\{\{goal.title\}\}/g, this.goal.title);
            if (step.repeatablePhrase) {
                step.repeatablePhrase = step.repeatablePhrase.replace(/\{\{goal.title\}\}/g, this.goal.title);
            }
        }
        this.currentStep.next(step);
    } else {
        this.currentStep.next(null); // Для стартового экрана или конца практики
    }
  }

  private getCurrentStep(): PracticeStep | null {
    if (!this.currentPractice) return null;
    const index = this.currentStepIndex.value;
    return (index >= 0) ? this.currentPractice.steps[index] : null;
  }
}
