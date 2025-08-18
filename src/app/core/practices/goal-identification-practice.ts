// Практика "Выявление установки"

import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { step, input, repeat, rating, practiceRating } from './practice-blocks';

/**
 * Практика "Выявление установки"
 */
export async function* goalIdentificationPractice(context: PracticeContext) {
  // Шаг 1: Определение цели
  yield input(
    'goal-definition',
    'Шаг 1: Определение цели',
    'Чего вы хотите достичь?',
    'practiceFormulation',
    'textarea',
    'Введите вашу цель...'
  );
  
  // Шаг 2: Убираем сопротивление
  yield repeat(
    'remove-resistance',
    'Шаг 2: Убираем сопротивление',
    'Проговаривай до состояния принятия:',
    'Можно мне было не хотеть "{{practiceFormulation}}". Мне так было можно и мне это было для чего-то нужно. Я сам не хотел(а) "{{practiceFormulation}}". Можно мне было не хотеть. У меня была на то причина. У меня была причина не хотеть "{{practiceFormulation}}". Мне так было можно.'
  );
  
  // Шаг 3: Смотрим образ
  yield input(
    'vision-analysis',
    'Шаг 3: Смотрим образ',
    'У меня уже есть "{{practiceFormulation}}". Что вы при этом видите? Не анализируйте образ, просто почувствуйте его, а затем опишите.',
    'imageAnalysis',
    'textarea',
    'Опишите образ достигнутой цели...'
  );
  
  // Шаг 4: Находим причину
  yield input(
    'find-concern',
    'Шаг 4: Находим причину',
    'Что смущает в образе?',
    'reasonForConcern',
    'textarea',
    'Опишите, что вас смущает...'
  );
  
  // Шаг 5: Вопросы чтобы вам помочь
  yield input(
    'helping-questions',
    'Шаг 5: Вопросы чтобы вам помочь',
    'Вопросы чтобы вам помочь: Какие эмоции у меня вызывает то, что я вижу? Как то, что я вижу, связано с моим сознательным запросом?',
    'questionsToHelp',
    'textarea',
    'Ответьте на вопросы...'
  );
  
  // Шаг 6: Формируем установку
  yield input(
    'formulate-belief',
    'Шаг 6: Формируем установку',
    'Дополните формулу "Если у меня будет "{{practiceFormulation}}", то..." - тем неприятным, что нашли в образе или ощущениях.',
    'installationFormulation',
    'textarea',
    'Если у меня будет "{{practiceFormulation}}", то...'
  );
  
  // Шаг 7: Проработка установки
  yield repeat(
    'work-with-belief',
    'Шаг 7: Проработка установки',
    'Проговаривай до состояния принятия и освобождения:',
    'Можно мне было думать, что {{installationFormulation}}. Но только я так думал(а). Это была только моя установка, только моя. Мне можно было пользоваться этой установкой, но она была только моя.'
  );
  
  // Финальная оценка ПРАКТИКИ
  yield practiceRating();
}

// Конфигурация практики
export const goalIdentificationPracticeConfig: PracticeConfig = {
  id: 'goal-identification',
  title: 'Выявление установки',
  description: 'Практика выявления и проработки установок относительно цели через работу с внутренними образами и убеждениями.',
  
  hasStartScreen: true,
  startScreenContent: {
    title: 'Выявление установки',
    description: 'Практика поможет выявить скрытые установки и страхи, связанные с достижением цели, и проработать их.',
    duration: '20-25 мин',
    level: 'Средний'
  },
  
  practiceFunction: goalIdentificationPractice,
  
  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'goal-identification',
      title: 'Выявление установки',
      route: '/practices/runner/goal-identification',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined
    });

    console.log('Practice completed with result:', result);
  }
};