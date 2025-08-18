// Практика "Интеграция тени"

import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { step, input, repeat, rating, practiceRating } from './practice-blocks';

/**
 * Практика "Интеграция тени"
 */
export async function* shadowIntegrationPractice(context: PracticeContext) {
  // Шаг 1: Ощущение
  yield step('feeling', 'Шаг 1: Ощущение', 'Почувствуй пространство, себя и свое тело.');

  // Шаг 2: Определение человека
  yield input(
    'target-person',
    'Шаг 2: Определение человека',
    'Кого бы ты хотел проработать? Напиши либо имя человека, либо типаж одним словом',
    'targetPerson',
    'textarea',
    'Опишите человека, с которым хотите поработать...'
  );

  // Шаг 3: Внутренняя реакция
  yield input(
    'internal-reaction',
    'Шаг 3: Внутренняя реакция',
    'Отметь, что включается в твоем внутреннем пространстве, когда ты думаешь о {{targetPerson}}?',
    'internalReaction',
    'textarea',
    'Опишите, что включается в вас...'
  );

  // Шаг 4: Осознание
  yield step(
    'awareness',
    'Шаг 4: Осознание',
    'Любая  реакция, которая в нас включается - неисправленное намерение внутри какого-то нашего желания. Осознай это.'
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
    'Проси Творца исправить это намерение в желании всей системы, всех людей, кто страдает от такой же проблемы.',
    'Творец, исправь намерения внутри нашеего общен желания из получения ради себя в получение ради отдачи, ради тебя, приблизь нас к себе и наполни эту нехватку благом и наслаждением.'
  );

  // Шаг 7: Милосердие к человеку
  yield step(
    'mercy-to-person',
    'Шаг 7: Милосердие',
    'Представь, что берешь за руку {{targetPerson}}. Прояви милосердие. Поставь руку на грудь. Почувствуй, какие нехватки он испытывает. Включи его и его ненаполненные желания в себя, присоедини их к себе для проработки.'
  );

  // Шаг 8: Исправление для всех (пропускаем шаг 8 согласно нумерации)
  yield repeat(
    'correct-all',
    'Шаг 9: Исправление для всех',
    'Проси Творца:',
    'Творец, исправь намерения внутри наших желаний и нехваток из получения ради себя в получение ради отдачи, ради тебя, приблизь нас к себе и наполни наши нехватки благом и наслаждением.'
  );

  // Шаг 10: Соединение с человеком
  yield repeat(
    'unite-with-person',
    'Шаг 10: Соединение',
    'Проговаривай:',
    'Все, что существует внутри этой системы, включая меня и этого человека - и есть Творец.'
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
export const shadowIntegrationPracticeConfig: PracticeConfig = {
  id: 'shadow-integration',
  title: 'Интеграция тени',
  description:
    'Практика для работы с проекциями и негативными реакциями на других людей через интеграцию теневых аспектов.',

  hasStartScreen: true,
  startScreenContent: {
    title: 'Интеграция тени',
    description:
      'Практика для работы с проекциями и негативными реакциями на других людей через интеграцию теневых аспектов.',
    duration: '20 мин',
    level: 'Продвинутый',
  },

  practiceFunction: shadowIntegrationPractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'shadow-integration',
      title: 'Интеграция тени',
      route: '/practices/runner/shadow-integration',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined,
    });

    console.log('Practice completed with result:', result);
  },
};
