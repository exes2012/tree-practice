import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { step, rating, breathing, practiceRating } from './practice-blocks';

/**
 * Практика "Дышать радостью" (Ихуд) на движке runner
 */
export async function* breathingJoyYichudPractice(context: PracticeContext) {
  // Подготовка
  yield step(
    'preparation',
    'Подготовка',
    'Царь Давид заканчивает книгу Теилим стихом: «Каждая душа, воздай хвалу Богу Алелу-йя». На святом языке слова «душа» и «дыхание» очень близки – нешама и нешима.'
  );

  // Дыхание хвалы
  yield step(
    'praise-breathing',
    'Дыхание хвалы',
    'Этот стих можно прочитать как «Каждое дыхание, воздай хвалу Богу Алелу-йя». Давайте глубоко дышать и славить Бога с каждым дыханием.'
  );

  // Ощущение присутствия
  yield step(
    'presence-feeling',
    'Ощущение присутствия',
    'С каждым дыханием я чувствую Твое Присутствие. С каждым дыханием я выражаю Тебе благодарность за Твой драгоценный дар мне – жизнь.'
  );

  // Слово радость
  yield step(
    'joy-word',
    'Слово радость',
    'Теперь мы будем дышать радостью. Вдохнем в нашу жизнь радость. Слово «радость» на иврите – хедва. Оно состоит из четырех букв хет, далет, вав и хей: ח ד ו ה'
  );

  // Четыре этапа дыхания
  yield step(
    'four-stages',
    'Четыре этапа дыхания',
    'Каждый дыхательный цикл состоит из четырех этапов: вдох, удерживание, выдох и отдых. Числовые значения букв слова хедва – 8, 4, 6 и 5.'
  );

  // Практика дыхания - автоматическое управляемое дыхание
  yield breathing(
    'breathing-practice',
    'Практика дыхания хедва (חדוה)',
    'Дышите в ритме слова "радость" на иврите. Робот будет вас направлять через каждую фазу дыхания: ח (Хет) — вдох 8 сек, ד (Далет) — задержка 4 сек, ו (Вав) — выдох 6 сек, ה (Хей) — пауза 5 сек.',
    8, // вдох
    4, // задержка  
    6, // выдох
    5, // пауза
    10 // количество циклов
  );

  // Ощущение жизни
  yield step(
    'life-feeling',
    'Ощущение жизни',
    'Ощущать жизнь – значит ощущать радость. Это радость от ощущения того, как мой Создатель вдыхает в мои ноздри дыхание жизни. С каждым дыханием я славлю Его.'
  );

  // Финальная оценка ПРАКТИКИ
  yield practiceRating();

  // Возвращаем результат
  return {
    rating: context.get('practice-final-rating')
  };
}

// Конфигурация практики
export const breathingJoyYichudPracticeConfig: PracticeConfig = {
  id: 'breathing-joy-yichud',
  title: 'Дышать радостью',
  description: '«Каждое дыхание, воздай хвалу Богу». Мы будем дышать радостью, используя ивритское слово חדוה (хедва) для ритма дыхания. Четыре буквы слова "радость" соответствуют четырем этапам дыхательного цикла: вдох (8), удерживание (4), выдох (6), отдых (5).',
  
  hasStartScreen: true,
  startScreenContent: {
    title: 'Дышать радостью',
    description: '«Каждое дыхание, воздай хвалу Богу». Мы будем дышать радостью, используя ивритское слово חדוה (хедва) для ритма дыхания. Четыре буквы слова "радость" соответствуют четырем этапам дыхательного цикла: вдох (8), удерживание (4), выдох (6), отдых (5).',
    duration: '20 мин',
    level: 'Начальный'
  },
  
  practiceFunction: breathingJoyYichudPractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'breathing-joy-yichud',
      title: 'Дышать радостью',
      route: '/practices/runner/breathing-joy-yichud',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined
    });

    console.log('Practice completed with result:', result);
  }
};