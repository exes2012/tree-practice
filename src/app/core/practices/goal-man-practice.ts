// Практика "Подъем МАН с целью"

import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { step, input, repeat, rating, practiceRating } from './practice-blocks';

/**
 * Практика "Подъем МАН с целью"
 */
export async function* goalManPractice(context: PracticeContext) {
  // Шаг 1: Ощущение
  yield step('feeling', 'Шаг 1: Ощущение', 'Почувствуй пространство, себя, свое тело.');

  // Шаг 2: Определение цели
  yield input(
    'goal-definition',
    'Шаг 2: Определение цели',
    'Какую цель ты бы хотел проработать?',
    'practiceFormulation',
    'textarea',
    'Введите вашу цель...'
  );

  // Шаг 3: Локализация чувств
  yield step(
    'localize-feelings',
    'Шаг 3: Локализация чувств',
    'Представьте, что вы достигли цели "{{practiceFormulation}}". Найди, включается ли что-то в ощущениях помимо радости. Найди, где это чувство ощущается. Его размер, форму. Найди, они внутри или снаружи тебя. Покажи рукой в это место.'
  );

  // Шаг 4: Самоотмена
  yield repeat(
    'self-cancellation',
    'Шаг 4: Самоотмена',
    'Положи руку туда, где находится это чувство. Одновременно с этим поставь руку на грудную точку, и проговаривай до состояния уменьшения важности и самоотмены:',
    'Мне не важно, будет ли достигнута "{{practiceFormulation}}". Мне нужна только связь с Творцом. И я здесь только для того, чтобы с Ним соединиться через эту цель.'
  );

  // Шаг 5: Найдите других
  yield repeat(
    'find-others',
    'Шаг 5: Найдите других',
    'Попытайся почувствовать все души в общей системе, которые страдают от не достижения этой цели. Скажи:',
    'Все души, которые страдают от недостижения этой цели, отпечатаны во мне. Мы связаны в одну общую систему.'
  );

  // Шаг 6: Проводник света
  yield repeat(
    'conduct-light',
    'Шаг 6: Проводник света',
    'Работай как проводник. Проси об исправлении намерения в их желаниях и притягивай в исправленные сосуды благо и наслаждение:',
    'Творец, исправь их намерение из получения ради себя в получение ради отдачи, ради тебя, приблизь их к себе и наполни их нехватки благом и наслаждением.'
  );

  // Шаг 7: Видение участников
  yield step(
    'see-participants',
    'Шаг 7: Видение участников',
    'Попроси Творца показать, какие еще участники вовлечены в "{{practiceFormulation}}".'
  );

  // Шаг 8: Свет вместо тьмы
  yield repeat(
    'light-instead-darkness',
    'Шаг 8: Свет вместо тьмы',
    'Отметь, какими ты видишь участников, связанных с "{{practiceFormulation}}". Проси Творца исправить намерение внутри желаний всех участников, связанных с этой целью:',
    'Творец, исправь намерения внутри желаний всех участников, связанных с "{{practiceFormulation}}" из получения ради себя в получение ради отдачи, ради тебя, приблизь их к себе и наполни их нехватки благом и наслаждением.'
  );

  // Шаг 9: Соединение с собой
  yield repeat(
    'connect-self',
    'Шаг 9: Соединение',
    'Отметь, каким ты видишь себя в отношении "{{practiceFormulation}}". Проси Творца:',
    'Творец, исправь мое намерение, связанное с "{{practiceFormulation}}" и другими душами. Чтобы оно было ради связи, ради отдачи, ради Тебя.'
  );

  // Шаг 10: Соединение всех участников
  yield repeat(
    'unite-all',
    'Шаг 10: Соединение всех участников',
    'Почувствуй ещё раз всех участников, связанных с "{{practiceFormulation}}", и саму эту цель. Собери все это воедино. Подними ощущение этих души и эту цель туда, где ощущается Творец, и удерживай эти ощущения там. Скажи:',
    'Все, что существует внутри этой системы, включая саму эту цель, включая мое желание - и есть Творец.'
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
export const goalManPracticeConfig: PracticeConfig = {
  id: 'goal-man',
  title: 'Подъем МАН с целью',
  description:
    'Практика подъема МАН через работу с целью, включение других участников и исправление намерений.',

  hasStartScreen: true,
  startScreenContent: {
    title: 'Подъем МАН с целью',
    description:
      'Практика поможет поработать с целью через каббалистический подход: самоотмена, включение других душ и подъем общего МАН.',
    duration: '25-30 мин',
    level: 'Продвинутый',
  },

  practiceFunction: goalManPractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'goal-man',
      title: 'Подъем МАН с целью',
      route: '/practices/runner/goal-man',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined,
    });

    console.log('Practice completed with result:', result);
  },
};
