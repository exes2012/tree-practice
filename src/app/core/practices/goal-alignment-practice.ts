// Практика "Сонастройка цели с Творцом"

import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import {
  step,
  input,
  repeat,
  rating,
  choice,
  stepWithButtons,
  practiceRating,
} from './practice-blocks';

/**
 * Практика "Сонастройка цели с Творцом"
 */
export async function* goalAlignmentPractice(context: PracticeContext) {
  // Шаг 1: Ощущение
  yield step('feeling', 'Шаг 1: Ощущение', 'Почувствуй пространство, себя, свое тело.');

  // Шаг 2: Определение цели
  yield input(
    'goal-definition',
    'Шаг 2: Определение цели',
    'Какую цель ты бы хотел проработать?',
    'practiceFormulation',
    'textarea',
    'Введите вашу цель...'
  );

  // Шаг 3: Видение достигнутой цели
  yield input(
    'vision-after-goal',
    'Шаг 3: Видение достигнутой цели',
    'Представьте, что цель "{{practiceFormulation}}" уже достигнута, что вы при этом видите?',
    'visionAfterAchievingGoal',
    'textarea',
    'Опишите ваше видение...'
  );

  // Шаг 4: Настройка на отдачу
  yield step(
    'tuning-to-bestowal',
    'Шаг 4: Настройка на отдачу',
    'Настройтесь на наслаждение от свойства отдачи. Выполните поочередно стадии Кетер, Хохма и Бина. Найдите за наслаждением от свойства отдачи Творца и его отношение к Вам.'
  );

  // Шаг 5: Сравнение ощущений и оценка сонастройки цели (НЕ рейтинг практики!)
  yield input(
    'goal-alignment-score',
    'Шаг 5: Сравнение ощущений',
    'Сравните ваше ощущение от уже достигнутой цели с ощущением благодарности и желания насладить Творца. Оцените от 1 до 10, насколько они совпадают.',
    'goalAlignmentScore',
    'number',
    undefined,
    5
  );

  // Шаг 6: Переформулировка цели
  yield input(
    'goal-refinement',
    'Шаг 6: Переформулировка цели',
    'Как бы вы могли переформулировать цель, чтобы Творец притягивал от вас на 10 из 10?',
    'rephrasedGoal',
    'textarea',
    'Переформулируйте вашу цель...'
  );

  // Шаг 7: Новое видение
  yield input(
    'new-vision',
    'Шаг 7: Новое видение',
    'Представьте, что цель в ее новой формулировке уже достигнута, что вы при этом видите?',
    'newVisionAfterGoal',
    'textarea',
    'Опишите новое видение...'
  );

  // Шаг 8: Повторная оценка сонастройки цели (НЕ рейтинг практики!)
  yield input(
    'new-goal-alignment-score',
    'Шаг 8: Повторная оценка',
    'Сравните ваше новое ощущение от достигнутой цели с ощущением благодарности и желания насладить Творца. Оцените от 1 до 10.',
    'newGoalAlignmentScore',
    'number',
    undefined,
    5
  );

  // Шаг 9: Вопрос об обновлении цели
  yield stepWithButtons(
    'goal-update-choice',
    'Шаг 9: Обновление цели',
    'Желаете ли вы перезаписать первоначальную формулировку цели на текущую сформулированную?',
    [
      {
        text: 'Да, обновить цель',
        value: 'true',
        targetStepId: 'practice-final-rating',
        saveValue: true,
      },
      {
        text: 'Нет, оставить как есть',
        value: 'false',
        targetStepId: 'practice-final-rating',
        saveValue: true,
      },
    ]
  );

  // Шаг 10: Финальная оценка ПРАКТИКИ
  yield practiceRating();
}

// Конфигурация практики
export const goalAlignmentPracticeConfig: PracticeConfig = {
  id: 'goal-alignment',
  title: 'Сонастройка цели с Творцом',
  description:
    'Практика сонастройки цели с волей Творца через проверку внутренних ощущений и переформулировку цели.',

  hasStartScreen: true,
  startScreenContent: {
    title: 'Сонастройка цели с Творцом',
    description:
      'Эта практика поможет вам проверить, насколько ваша цель соответствует духовному пути, и сонастроить ее с высшей волей.',
    duration: '15-30 мин',
    level: 'Средний',
  },

  practiceFunction: goalAlignmentPractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'goal-alignment',
      title: 'Сонастройка цели с Творцом',
      route: '/practices/runner/goal-alignment',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined,
    });

    console.log('Practice completed with result:', result);
  },
};
