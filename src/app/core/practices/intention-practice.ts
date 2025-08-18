import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { intentionStep } from './practice-blocks';

/**
 * Универсальная практика намерения на движке runner
 * Получает данные упражнения через контекст
 */
export async function* intentionPractice(context: PracticeContext) {
  // Получаем данные упражнения из контекста
  const exerciseTitle = context.get<string>('exerciseTitle') || 'Упражнение намерения';
  const exerciseDescription =
    context.get<string>('exerciseDescription') || 'Описание упражнения не указано';

  // console.log('Intention practice context:', exerciseTitle, exerciseDescription);

  // Единственный шаг с упражнением - используем полученные оригинальные данные
  yield intentionStep('intention-exercise', exerciseTitle, exerciseDescription);

  // Возвращаем результат с действием из контекста
  const action = context.get('intention-exercise');
  console.log('Practice returning result with action:', action);

  return {
    action: action, // 'set_as_challenge' или 'go_home'
  };
}

// Конфигурация практики
export const intentionPracticeConfig: PracticeConfig = {
  id: 'intention-practice',
  title: 'Упражнения намерения',
  description: 'Упражнения для развития правильного намерения в духовной работе',

  hasStartScreen: false, // НЕ показываем стартовую страницу

  practiceFunction: intentionPractice,

  onFinish: async (context, result) => {
    const action = context.get('intention-exercise'); // Получаем действие из контекста
    const exerciseTitle = context.get<string>('exerciseTitle');
    const exerciseDescription = context.get<string>('exerciseDescription');

    console.log('Intention practice onFinish:', { action, exerciseTitle, exerciseDescription });

    if (action === 'set_as_challenge' && exerciseTitle && exerciseDescription) {
      // Устанавливаем как намерение дня
      const challenge = {
        title: exerciseTitle,
        description: exerciseDescription.replace(/<br>/g, '\n'), // Возвращаем обратно переносы строк
      };
      localStorage.setItem('dailyChallenge', JSON.stringify(challenge));
      console.log('Set as daily challenge:', challenge);
    }

    // Сохраняем запись о выполнении упражнения
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'intention-practice',
      title: exerciseTitle || 'Упражнение намерения',
      route: '/practices/runner/intention-practice',
      completedAt,
      dateKey,
      // НЕ сохраняем rating для упражнений намерения
      duration: result.duration as number | undefined,
    });

    console.log('Intention practice completed with result:', result);
  },
};
