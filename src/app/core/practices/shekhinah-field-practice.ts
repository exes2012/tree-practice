// Практика "Подъем МАН через общее поле Шхины" в новой архитектуре

import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { step, repeat, rating, practiceRating } from './practice-blocks';

/**
 * Практика "Подъем МАН через общее поле Шхины" в новой архитектуре
 */
export async function* shekhinahFieldPractice(context: PracticeContext) {
  // Шаг 1: Ощущение
  yield step('feeling', 'Шаг 1: Ощущение', 'Почувствуй пространство, себя, свое тело.');

  // Шаг 2: Включение в систему
  yield repeat(
    'system-inclusion',
    'Шаг 2: Включение в систему',
    'Почувствуй, что все, что ты сейчас ощущаешь в своих органах восприятия, ощущает вся система душ. Нет отдельного Я. Скажи:',
    'Все, что я сейчас ощущаю, все, что сейчас проходит через мои органы восприятия, ощущает вся система. Весь поток ощущений в здесь и сейчас переживает единое целое.'
  );

  // Шаг 3: Поиск нехватки
  yield step(
    'find-lack',
    'Шаг 3: Поиск нехватки',
    'Почувствуй, какая общая нехватка есть сейчас у всей системы. Найди, где она ощущается. Ее размер, форму. Найди, она ощущается внутри или снаружи тебя. Покажи рукой туда.'
  );

  // Шаг 4: Самоотмена
  yield repeat(
    'self-cancellation',
    'Шаг 4: Самоотмена',
    'Чувствуя себя всей системой целиком, поставь руку на грудную точку и проговаривай до состояния уменьшения важности и самоотмены.',
    'Системе не важно, что она переживает в своих органах восприятия, боль или удовольствие, страдание или радость. Ей важна только связь с Творцом. И она здесь только для того, чтобы соединиться с ним через эту нехватку.'
  );

  // Шаг 6: Проводник света (сохраняем оригинальную нумерацию)
  yield repeat(
    'conduct-light',
    'Шаг 6: Проводник света',
    'Работай как проводник. Проси об исправлении намерения внутри желания в общей системе и притягивай в исправленные сосуды всей системы благо и наслаждение.',
    'Творец, исправь намерение внутри нашего общего желания из получения ради себя в получение ради отдачи, ради тебя, приблизь нас к себе и наполни наши нехватки благом и наслаждением.'
  );

  // Шаг 7: Соединение
  yield repeat(
    'unite-system',
    'Шаг 7: Соединение',
    'Почувствуй ещё раз всю систему целиком, все ее сосуды. Собери все их сосуды воедино, как собрание всех душ. Подними их в точку, где ощущается Творец, и удерживай его там. Скажи:',
    'Всё, что существует внутри этой системы, включая саму эту систему — и есть Творец. Система включена в Него.'
  );

  // Шаг 8: Благодарность
  yield step(
    'gratitude',
    'Шаг 8: Благодарность',
    'Вырази благодарность Творцу в меру получения облегчения и изменения. "Благодарю за это общение".'
  );

  // Финальная оценка ПРАКТИКИ
  yield practiceRating();
}

// Конфигурация практики
export const shekhinahFieldPracticeConfig: PracticeConfig = {
  id: 'shekhinah-field',
  title: 'Подъем МАН через общее поле Шхины',
  description:
    'Это упражнение направлено на подъем МАН через ощущение себя частью единой системы душ и работу с общими нехватками всей системы.',

  hasStartScreen: true,
  startScreenContent: {
    title: 'Подъем МАН через общее поле Шхины',
    description:
      'Это упражнение направлено на подъем МАН через ощущение себя частью единой системы душ и работу с общими нехватками всей системы.',
    duration: '20 мин',
    level: 'Продвинутый',
  },

  practiceFunction: shekhinahFieldPractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'shekhinah-field',
      title: 'Подъем МАН через общее поле Шхины',
      route: '/practices/runner/shekhinah-field',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined,
    });

    console.log('Practice completed with result:', result);
  },
};
