import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { step, rating, practiceRating } from './practice-blocks';

/**
 * Практика "Благодарность" (Ихуд) на движке runner
 */
export async function* gratitudeYichudPractice(context: PracticeContext) {
  // Подготовка
  yield step(
    'preparation',
    'Подготовка',
    'Проснувшись утром, мы благодарим Бога за то, что Он вернул нам душу. Первые слова, которые мы произносим, пробудившись.'
  );

  // Модэ ани на русском
  yield step(
    'mode-ani-russian',
    'Модэ ани на русском',
    'Благодарю Тебя, Владыка живой и вечный, за то, что Ты, по милости Своей, вернул мне душу мою. Как велика Твоя вера в меня.'
  );

  // Модэ ани на иврите
  yield step(
    'mode-ani-hebrew',
    'Модэ ани на иврите',
    'На иврите это звучит так: Модэ ани лефанеха мелех хай ве-кайям, ше-хехезарта би нишмати бехемла. Раба эмунатеха.'
  );

  // Пустой сосуд
  yield step(
    'empty-vessel',
    'Пустой сосуд',
    'Чтобы выразить нашу искреннюю благодарность, мы должны ощущать себя пустым сосудом. Если бы не доброта и сострадание Дающего нам жизнь, мы остались бы пустыми, лишенными всего.'
  );

  // Присутствие Царя
  yield step(
    'kings-presence',
    'Присутствие Царя',
    'Исполненные истинного смирения, мы ощущаем присутствие Вечного Царя, пребывающего над нами. Каждую ночь перед отходом ко сну мы возвращаем Богу наши обессиленные, «изношенные» души.'
  );

  // Обновление души
  yield step(
    'soul-renewal',
    'Обновление души',
    'Каждое утро мы получаем наши души обновленными, полными свежих сил. Как велика вера Бога в нас! Учат мудрецы, что сон – «одна шестидесятая» часть смерти.'
  );

  // Воскрешение
  yield step(
    'resurrection',
    'Воскрешение',
    'Получая «почти умершую» душу, Бог возвращает нам ее возрожденной. Так же как Он верен нам в этом мире, так же Он будет верен нам и в Мире Грядущем, и мы полагаемся на Него в том, что он воскресит нас после смерти.'
  );

  // Весь день
  yield step(
    'all-day',
    'Весь день',
    'Наш день начинается с этой мысли о благодарности Б-гу. Мысль эта, «выгравированная» в нашем сознании, сопровождает нас целый день.'
  );

  // Финальная оценка ПРАКТИКИ
  yield practiceRating();

  // Возвращаем результат
  return {
    rating: context.get('practice-final-rating')
  };
}

// Конфигурация практики
export const gratitudeYichudPracticeConfig: PracticeConfig = {
  id: 'gratitude-yichud',
  title: 'Благодарность',
  description: 'Утренняя молитва благодарности за возвращение души. Мы изучим смысл слов "Модэ ани" и их глубокое духовное значение. Эта практика помогает начать день с правильного настроя благодарности и смирения перед Творцом.',
  
  hasStartScreen: true,
  startScreenContent: {
    title: 'Благодарность',
    description: 'Утренняя молитва благодарности за возвращение души. Мы изучим смысл слов "Модэ ани" и их глубокое духовное значение. Эта практика помогает начать день с правильного настроя благодарности и смирения перед Творцом.',
    duration: '18 мин',
    level: 'Начальный'
  },
  
  practiceFunction: gratitudeYichudPractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'gratitude-yichud',
      title: 'Благодарность',
      route: '/practices/runner/gratitude-yichud',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined
    });

    console.log('Practice completed with result:', result);
  }
};