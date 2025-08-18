import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { step, rating, hebrewStep, practiceRating } from './practice-blocks';

/**
 * Практика "Любовь" (Ихуд) на движке runner
 */
export async function* loveYichudPractice(context: PracticeContext) {
  // Подготовка
  yield step(
    'preparation',
    'Подготовка',
    'Любовь есть Божественная способность к творению. Сосредоточимся, чтобы пробудить эту способность в нашей собственной душе.'
  );

  // Произнесение слова
  yield step(
    'pronunciation',
    'Произнесение слова',
    'Пусть ивритское слово ахава – «любовь» – отзовется в нашем сердце и зазвучит в наших устах: а-ха-ва. Произносите медленно и вслушивайтесь в звучание.'
  );

  // Визуализация букв любви
  yield hebrewStep(
    'love-letters',
    'Визуализация букв',
    'Теперь мысленно представим себе слово ахава. Четыре буквы этого слова – алеф, хей, бейт и хей – это первая, пятая, вторая и пятая буквы ивритского алфавита.',
    'אהבה',
    {
      color: 'text-pink-600 dark:text-pink-400',
      size: 'extra-large',
      transliteration: 'ахава - любовь',
    }
  );

  // Разделение букв
  yield hebrewStep(
    'separated-letters',
    'Четыре буквы любви',
    'Алеф, хей, бейт, хей - каждая буква несет в себе особую энергию и смысл. Созерцайте каждую букву отдельно.',
    'א ה ב ה',
    {
      color: 'text-red-600 dark:text-red-400',
      size: 'large',
      transliteration: 'алеф - хей - бейт - хей',
    }
  );

  // Гиматрия единства - слово "один"
  yield hebrewStep(
    'gematria-unity',
    'Гиматрия единства',
    'Сумма их числовых значений – гиматрия – равна 13. Это же число – 13 – есть также числовое значение слова «один», эхад. Почувствуйте связь между любовью и единством.',
    'אחד',
    {
      color: 'text-blue-600 dark:text-blue-400',
      size: 'large',
      transliteration: 'эхад - один (13)',
    }
  );

  // Ощущение единства
  yield step(
    'unity-feeling',
    'Ощущение единства',
    'Любовь – это ощущение единства с любимым; это чувство, побуждающее нас стать близким ему, вплоть до полного единения. Давайте почувствуем, что мы есть одно целое с Творцом и со всем Его творением.'
  );

  // Аббревиатура света
  yield hebrewStep(
    'light-abbreviation',
    'Аббревиатура света',
    'Продолжим медитацию над словом ахава. Четыре его буквы составляют аббревиатуру фразы «Свет Святого Благословенного» (Ор а-Кадош Барух ху).',
    'אור הקדוש ברוך הוא',
    {
      color: 'text-yellow-600 dark:text-yellow-400',
      size: 'medium',
      transliteration: 'Ор а-Кадош Барух ху',
    }
  );

  // Излучение любви - финальная визуализация
  yield hebrewStep(
    'love-radiation',
    'Излучение любви',
    'Своим Бесконечным светом, Своей любовью ко всем Бог непрерывно заново творит мир. Да будем и мы идти Его путями и излучать из наших душ животворящую силу любви.',
    'אהבה',
    {
      color: 'text-purple-600 dark:text-purple-400',
      size: 'extra-large',
      transliteration: 'ахава - любовь творящая',
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
export const loveYichudPracticeConfig: PracticeConfig = {
  id: 'love-yichud',
  title: 'Любовь (א ה ב ה)',
  description:
    'Любовь есть Божественная способность к творению. Медитация над четырьмя буквами слова "любовь" на иврите - אהבה (ахава). Каждая буква открывает особый аспект Божественной любви и помогает пробудить в душе способность к творению.',

  hasStartScreen: true,
  startScreenContent: {
    title: 'Любовь (א ה ב ה)',
    description:
      'Любовь есть Божественная способность к творению. Медитация над четырьмя буквами слова "любовь" на иврите - אהבה (ахава). Каждая буква открывает особый аспект Божественной любви и помогает пробудить в душе способность к творению.',
    duration: '15 мин',
    level: 'Начальный',
  },

  practiceFunction: loveYichudPractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'love-yichud',
      title: 'Любовь (א ה ב ה)',
      route: '/practices/runner/love-yichud',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined,
    });

    console.log('Practice completed with result:', result);
  },
};
