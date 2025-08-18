import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { step, rating, hebrewStep, practiceRating } from './practice-blocks';

/**
 * Практика "Пламя свечи" (Ихуд) на движке runner
 */
export async function* candleFlameYichudPractice(context: PracticeContext) {
  // Подготовка
  yield step(
    'preparation',
    'Подготовка',
    'Обратимся к медитации над словами царя Шломо в Книге Мишлей (Притч): «Душа человека – свеча Бога».'
  );

  // Пламя в движении
  yield step(
    'flame-movement',
    'Пламя в движении',
    'Пламя свечи все время живо и находится в движении, качаясь в разные стороны. Иногда эти колебания очень сильны, иногда – почти незаметны.'
  );

  // Душа как пламя
  yield step(
    'soul-as-flame',
    'Душа как пламя',
    'Такие же движения совершает живая человеческая душа, свеча Бога: она все время колеблется в разные стороны, стремясь вернуться к своему источнику, Бесконечному Свету Бога.'
  );

  // Тело и душа
  yield step(
    'body-and-soul',
    'Тело и душа',
    'В этом физическом мире душа облечена в тело, поэтому колебания души приводят к соответствующим колебаниям тела.'
  );

  // Раскачивание вперед-назад с движением
  yield step(
    'forward-backward',
    'Раскачивание вперед-назад',
    'Давайте встанем прямо и будем раскачиваться. Сначала будем раскачиваться вперед–назад. Такое направление раскачивания отражает мужской аспект нашей души.<br><br><strong>🧘‍♂️ Встаньте и мягко раскачивайтесь вперед-назад</strong>'
  );

  // Раскачивание вправо-влево с движением
  yield step(
    'right-left',
    'Раскачивание вправо-влево',
    'Теперь будем раскачиваться вправо–влево. Раскачивание в этом направлении отражает женский аспект нашей души. Если вы раскачиваетесь стоя, тело должно сгибаться в пояснице.<br><br><strong>🧘‍♀️ Переключитесь на раскачивание вправо-влево</strong>'
  );

  // Тора и молитва
  yield step(
    'torah-prayer',
    'Тора и молитва',
    'Естественные колебательные движения души, подобные движениям пламени свечи, наиболее ярко проявляются при изучении святой Торы или при молитве из глубины сердца.'
  );

  // Стремление к Свету - финальная медитация
  yield step(
    'striving-to-light',
    'Стремление к Свету',
    'Искра Б-га в нас, пламя нашей души, всегда стремится вернуться к Б-жественному Бесконечному Свету и слиться с Ним. Пусть эта искра непрестанно разгорается ярче и ярче. Как бы ни мы колебались, любое наше движение направлено к Тебе.'
  );

  // Финальная оценка ПРАКТИКИ
  yield practiceRating();

  // Возвращаем результат
  return {
    rating: context.get('practice-final-rating'),
  };
}

// Конфигурация практики
export const candleFlameYichudPracticeConfig: PracticeConfig = {
  id: 'candle-flame-yichud',
  title: 'Пламя свечи',
  description:
    '«Душа человека – свеча Бога». Мы будем медитировать на движения пламени свечи как отражение движений нашей души. Практика включает физические движения - раскачивание вперед-назад (мужской аспект) и вправо-влево (женский аспект).',

  hasStartScreen: true,
  startScreenContent: {
    title: 'Пламя свечи',
    description:
      '«Душа человека – свеча Бога». Мы будем медитировать на движения пламени свечи как отражение движений нашей души. Практика включает физические движения - раскачивание вперед-назад (мужской аспект) и вправо-влево (женский аспект).',
    duration: '20 мин',
    level: 'Начальный',
  },

  practiceFunction: candleFlameYichudPractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'candle-flame-yichud',
      title: 'Пламя свечи',
      route: '/practices/runner/candle-flame-yichud',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined,
    });

    console.log('Practice completed with result:', result);
  },
};
