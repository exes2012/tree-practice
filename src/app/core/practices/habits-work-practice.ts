// Практика "Работа с привычками"

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
 * Практика "Работа с привычками"
 */
export async function* habitsWorkPractice(context: PracticeContext) {
  // Шаг 1: Ощущение
  yield step('feeling', 'Шаг 1: Ощущение', 'Почувствуй пространство, себя и свое тело.');

  // Шаг 2: Определение привычки
  yield input(
    'negative-habit',
    'Шаг 2: Определение привычки',
    'С какой негативной привычкой ты бы хотел поработать?',
    'negativeHabit',
    'textarea',
    'Опишите вашу негативную привычку...'
  );

  // Шаг 3: Внутренняя реакция
  yield input(
    'internal-trigger',
    'Шаг 3: Внутренний триггер',
    'Отметь, что включается в твоем внутреннем пространстве прямо перед тем, как тебе начинает хотеться {{negativeHabit}}?',
    'internalTrigger',
    'textarea',
    'Опишите, что включается в вас...'
  );

  // Шаг 4: Осознание
  yield step(
    'awareness',
    'Шаг 4: Осознание',
    'Любая реакция, которая активирует привычку - неисправленное намерение внутри какого-то нашего желания. Осознай это.'
  );

  // Шаг 5: Поиск нехватки
  yield step(
    'find-lack',
    'Шаг 5: Поиск желания',
    'Удерживая свою реакцию, найди это желание и почувствуй в нем не исправленное намерение.'
  );

  // Шаг 6: Исправление намерения
  yield repeat(
    'correct-intention',
    'Шаг 6: Исправление намерения',
    'Проси Творца исправить это намерение в желании всей системы, всех, кто страдает от такой же проблемы.',
    'Творец, исправь намерения внутри нашего общего желания из получения ради себя в получение ради отдачи, ради тебя, приблизь нас к себе и наполни эту нехватку благом и наслаждением.'
  );

  // Шаг 7: Проверка сопротивления с простыми кнопками
  yield stepWithButtons(
    'resistance-check',
    'Шаг 7: Проверка сопротивления',
    'Есть ли кто-то или что-то, что сопротивляется решению этой проблемы? Другие люди, существа, внутренние состояния.',
    [
      {
        text: 'Да',
        value: 'yes',
        targetStepId: 'mercy',
        saveValue: true,
      },
      {
        text: 'Нет',
        value: 'no',
        targetStepId: 'unite-all',
        saveValue: true,
      },
    ]
  );

  // Шаг 8: Милосердие (только при выборе "Да")
  yield step(
    'mercy',
    'Шаг 8: Милосердие',
    'Представь, что берешь за руку того или то, что сопротивляется решению. Прояви милосердие. Поставь руку на грудь. Почувствуй, какие нехватки он испытывает. Включи его и его ненаполненные желания в себя, присоедини их к себе для проработки.'
  );

  // Шаг 9: Исправление для всех
  yield repeat(
    'correct-all',
    'Шаг 9: Исправление для всех',
    'Проси Творца:',
    'Творец, исправь намерения внутри наших желаний и нехваток из получения ради себя в получение ради отдачи, ради тебя, приблизь нас к себе и наполни наши нехватки благом и наслаждением.'
  );

  // Шаг 10: Соединение всех участников
  yield repeat(
    'unite-all',
    'Шаг 10: Соединение всех участников',
    'Почувствуй еще раз всех участников, включенных в проблему, все их сосуды. Проговаривай:',
    'Все, что существует внутри этой системы, включая эту проблему - и есть Творец.'
  );

  // Шаг 11: Благодарность
  yield step(
    'gratitude',
    'Шаг 11: Благодарность',
    'Вырази благодарность Творцу в меру получения облегчения и изменения. "Благодарю за это общение".'
  );

  // Финальная оценка ПРАКТИКИ
  yield practiceRating();
}

// Конфигурация практики
export const habitsWorkPracticeConfig: PracticeConfig = {
  id: 'habits-work',
  title: 'Работа с привычками',
  description:
    'Практика для работы с негативными привычками через исправление внутренних намерений и автоматических реакций.',

  hasStartScreen: true,
  startScreenContent: {
    title: 'Работа с привычками',
    description:
      'Практика для работы с негативными привычками через исправление внутренних намерений и автоматических реакций.',
    duration: '20 мин',
    level: 'Средний',
  },

  practiceFunction: habitsWorkPractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'habits-work',
      title: 'Работа с привычками',
      route: '/practices/runner/habits-work',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined,
    });

    console.log('Practice completed with result:', result);
  },
};
