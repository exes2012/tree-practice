import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { step, rating, hebrewStep, practiceRating } from './practice-blocks';

/**
 * Практика "Шаббат" (Ихуд) на движке runner
 */
export async function* shabbatYichudPractice(context: PracticeContext) {
  // Подготовка
  yield step(
    'preparation',
    'Подготовка',
    'Взаимоотношения еврейской души со святым днем Шабат подобны браку. Шабат – это «супруга» еврейской души (сама душа в данном случае играет роль мужского начала).'
  );

  // Соблюдение Шабата
  yield step(
    'observance',
    'Соблюдение Шабата',
    'Посредством соблюдения Шабата как в духовном, так и в физическом смысле мы приходим к ощущению Божественной тайны Шабата в течение всей недели; всю неделю мы предвкушаем наступление Шабата.'
  );

  // Слово Шабат с визуализацией
  yield hebrewStep(
    'shabbat-word',
    'Слово Шабат',
    'Приступим к медитации над словом Шабат. Как учит нас книга Зоар, слово Шабат – это фактически одно из Имен Бога.',
    'שבת',
    {
      color: 'text-purple-600 dark:text-purple-400',
      size: 'extra-large',
      transliteration: 'Шабат'
    }
  );

  // Три буквы
  yield hebrewStep(
    'three-letters',
    'Три буквы',
    'Три буквы слова Шабат: шин, бейт и тав – стоят во главе следующих слов: «мир» Шалом, «благословение» Браха, «наслаждение» Таануг.',
    'ש ב ת',
    {
      color: 'text-blue-600 dark:text-blue-400',
      size: 'large',
      transliteration: 'шин - бейт - тав'
    }
  );

  // Мир - Шалом
  yield hebrewStep(
    'peace-shalom',
    'Мир как сосуд',
    'Учат мудрецы, что мир – это тот сосуд, который мы сами должны создать для получения света Божественного благословения, касающегося любой области: детей, доброго здоровья и благосостояния.',
    'שלום',
    {
      color: 'text-green-600 dark:text-green-400',
      size: 'large',
      transliteration: 'Шалом - мир'
    }
  );

  // Благословение - Браха
  yield hebrewStep(
    'blessing-bracha',
    'Божественное благословение',
    'Благословение течет от Творца в созданный нами сосуд мира. Это поток Божественной милости во все сферы нашей жизни.',
    'ברכה',
    {
      color: 'text-yellow-600 dark:text-yellow-400',
      size: 'large',
      transliteration: 'Браха - благословение'
    }
  );

  // Наслаждение - Таануг
  yield hebrewStep(
    'pleasure-taanug',
    'Божественное наслаждение',
    'Основным ощущением Шабата, ощущением Божественного света, вливающегося в созданный нами сосуд – мир, является ощущение Божественного наслаждения.',
    'תענוג',
    {
      color: 'text-red-600 dark:text-red-400',
      size: 'large',
      transliteration: 'Таануг - наслаждение'
    }
  );

  // Шабат шалом
  yield hebrewStep(
    'shabbat-shalom',
    'Шабат шалом',
    'В Шабат мы желаем друг другу: Шабат шалом – Мирной Субботы. Или же: Шабат шалом у-меворах – Мирной и благословенной Субботы.',
    'שבת שלום',
    {
      color: 'text-indigo-600 dark:text-indigo-400',
      size: 'large',
      transliteration: 'Шабат шалом'
    }
  );

  // Полнота ощущения
  yield step(
    'fullness',
    'Полнота ощущения',
    'Да достигнем мы все в Шабат в полной мере ощущения мира, благословения и Божественного наслаждения.'
  );

  // Финальная оценка ПРАКТИКИ
  yield practiceRating();

  // Возвращаем результат
  return {
    rating: context.get('practice-final-rating')
  };
}

// Конфигурация практики
export const shabbatYichudPracticeConfig: PracticeConfig = {
  id: 'shabbat-yichud',
  title: 'Шаббат',
  description: 'Медитация на слово Шаббат ש-ב-ת и его три составляющие: мир (שלום), благословение (ברכה) и наслаждение (תענוג). Практика ведет через три уровня шаббатнего сознания.',
  
  hasStartScreen: true,
  startScreenContent: {
    title: 'Шаббат',
    description: 'Медитация на слово Шаббат ש-ב-ת и его три составляющие: мир (שלום), благословение (ברכה) и наслаждение (תענוג). Практика ведет через три уровня шаббатнего сознания.',
    duration: '22 мин',
    level: 'Средний'
  },
  
  practiceFunction: shabbatYichudPractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'shabbat-yichud',
      title: 'Шаббат',
      route: '/practices/runner/shabbat-yichud',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined
    });

    console.log('Practice completed with result:', result);
  }
};