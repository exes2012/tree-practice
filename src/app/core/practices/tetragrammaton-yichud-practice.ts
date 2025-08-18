import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { step, rating, hebrewStep, practiceRating } from './practice-blocks';

/**
 * Практика "Четырехбуквенное имя" (Ихуд) на движке runner
 */
export async function* tetragrammatonYichudPractice(context: PracticeContext) {
  // Подготовка
  yield step(
    'preparation',
    'Подготовка',
    'Собственное Имя Бога обычно называется «Тетраграмматон», согласно мудрецам, называвшим его «Четырехбуквенным Именем». На иврите его называют «Имя Авайе».'
  );

  // Значение Имени
  yield step(
    'meaning',
    'Значение Имени',
    'Хотя Суть этого Имени выше любого разумения, оно происходит от ивритского корня, означающего «быть» или «приводить другого в состояние бытия». Имя Авайе – это вечное бытие, это Божественная сила, благодаря которой вся реальность находится в состоянии бытия.'
  );

  // Четыре буквы с полной визуализацией
  yield hebrewStep(
    'four-letters',
    'Четыре буквы',
    'Несмотря на то, что нам запрещено произносить Имя Авайе так, как оно пишется, мы можем медитировать над его четырьмя буквами йуд, хей, вав, хей.',
    'י ה ו ה',
    {
      color: 'text-purple-600 dark:text-purple-400',
      size: 'extra-large',
      transliteration: 'йуд - хей - вав - хей',
    }
  );

  // Буква Йуд - всеприсутствие
  yield hebrewStep(
    'letter-yud',
    'Буква Йуд',
    'Сосредоточимся на первой букве Имени Авайе, букве йуд. Она связана с сознанием абсолютного всеприсутствия Бога. Нет никого и ничего, кроме Него, как и нет места свободного от Его присутствия. «Слушай, Израиль Авайе – Бог наш, Авайе Один».',
    'י',
    {
      color: 'text-blue-600 dark:text-blue-400',
      size: 'extra-large',
      transliteration: 'Йуд - всеприсутствие',
    }
  );

  // Буква Хей (первая) - творение
  yield hebrewStep(
    'letter-heh-first',
    'Буква Хей (первая)',
    'Перейдем теперь к медитации над второй буквой Имени Авайе, первой буквой хей. Это сознание Божественного процесса творения. Почувствуйте, как все мироздание, включая и вас самих творится каждый миг из ничего, и это происходит здесь и сейчас.',
    'ה',
    {
      color: 'text-green-600 dark:text-green-400',
      size: 'extra-large',
      transliteration: 'Хей - творение',
    }
  );

  // Буква Вав - единство
  yield hebrewStep(
    'letter-vav',
    'Буква Вав',
    'Теперь перейдем к медитации над третьей буквой Имени Авайе, буквой вав. Это сознание принадлежности к великому единому целому. Ощутите мироздание как одно гигантское целое. Никакая ее часть не существует сама по себе.',
    'ו',
    {
      color: 'text-yellow-600 dark:text-yellow-400',
      size: 'extra-large',
      transliteration: 'Вав - единство',
    }
  );

  // Буква Хей (вторая) - индивидуальность
  yield hebrewStep(
    'letter-heh-second',
    'Буква Хей (вторая)',
    'Теперь перейдем к медитации над четвертой буквой Имени Авайе, второй буквой хей. Это сознание себя как одного, отдельно существующего индивидуума. Человеку следует полностью осознавать свою ответственность, ибо он располагает свободой выбора.',
    'ה',
    {
      color: 'text-red-600 dark:text-red-400',
      size: 'extra-large',
      transliteration: 'Хей - индивидуальность',
    }
  );

  // Единство уровней
  yield hebrewStep(
    'unity-levels',
    'Единство уровней',
    'И, наконец, придите к осознанию того, что все эти четыре уровня сознания, по существу, едины.',
    'י ה ו ה',
    {
      color: 'text-indigo-600 dark:text-indigo-400',
      size: 'large',
      transliteration: 'Единство четырех уровней',
    }
  );

  // Шма Исраэль
  yield hebrewStep(
    'shma-israel',
    'Шма Исраэль',
    'Скажите еще раз: Шма Исраэль! Адо-най – Эло-хейну, Адо-най эхад. Слушай, Израиль Авайе – Бог наш, Авайе Один.',
    'שמע ישראל',
    {
      color: 'text-purple-600 dark:text-purple-400',
      size: 'large',
      transliteration: 'Шма Исраэль',
    }
  );

  // Финальная оценка ПРАКТИКИ
  yield practiceRating();

  // Возвращаем результат
  return {
    rating: context.get('practice-final-rating'),
  };
}

// Конфигурация практики
export const tetragrammatonYichudPracticeConfig: PracticeConfig = {
  id: 'tetragrammaton-yichud',
  title: 'Четырехбуквенное имя',
  description:
    'Медитация над четырьмя буквами священного Имени י-ה-ו-ה, каждая из которых соответствует определенному уровню сознания. Практика ведет через четыре уровня осознания единства.',

  hasStartScreen: true,
  startScreenContent: {
    title: 'Четырехбуквенное имя',
    description:
      'Медитация над четырьмя буквами священного Имени י-ה-ו-ה, каждая из которых соответствует определенному уровню сознания. Практика ведет через четыре уровня осознания единства.',
    duration: '30 мин',
    level: 'Продвинутый',
  },

  practiceFunction: tetragrammatonYichudPractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'tetragrammaton-yichud',
      title: 'Четырехбуквенное имя',
      route: '/practices/runner/tetragrammaton-yichud',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined,
    });

    console.log('Practice completed with result:', result);
  },
};
