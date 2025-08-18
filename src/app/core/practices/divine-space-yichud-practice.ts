import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { step, rating, practiceRating } from './practice-blocks';

/**
 * Практика "Божественное пространство" (Ихуд) на движке runner
 */
export async function* divineSpaceYichudPractice(context: PracticeContext) {
  // Подготовка
  yield step(
    'preparation',
    'Подготовка',
    'Давайте мысленно построим вокруг нас с помощью медитации Божественное пространство, духовное святилище. В пространстве есть шесть направлений.'
  );

  // Пространство сверху
  yield step(
    'space-above',
    'Пространство сверху',
    'Осознайте Божественное пространство, находящееся над вами. Это сознание первого из Десяти Речений: «Я – Авайе, Бог твой». Это сознание Всемогущества Бога, Его Всеприсутствия и Его Божественного Провидения.'
  );

  // Пространство снизу
  yield step(
    'space-below',
    'Пространство снизу',
    'Осознайте Божественное пространство под вами. Это сознание второго из Десяти Речений: не верить ни в какого другого бога, помимо Него. Это сознание Одного Бога Израиля.'
  );

  // Пространство спереди
  yield step(
    'space-front',
    'Пространство спереди',
    'Осознайте Божественное пространство перед вами. Это сознание абсолютного Единства Бога. «Слушай, Израиль Авайе – Бог наш, Авайе Один».'
  );

  // Пространство справа
  yield step(
    'space-right',
    'Пространство справа',
    'Осознайте Божественное пространство справа от вас. Это сознание и ощущение любви к Богу; любви всем сердцем, всей душой, всем существом своим.'
  );

  // Пространство слева
  yield step(
    'space-left',
    'Пространство слева',
    'Осознайте Божественное пространство слева от вас. Это сознание и ощущение трепета, испытываемого в присутствии Его, Бесконечного. Да поможет нам этот трепет избавиться от всех видов отрицательной энергии.'
  );

  // Пространство сзади
  yield step(
    'space-back',
    'Пространство сзади',
    'Осознайте Божественное пространство сзади от вас. Это сознание бдительности, постоянной готовности бороться со злом. Мы должны постоянно держать охрану возле нашей задней двери.'
  );

  // Искра Машиаха
  yield step(
    'mashiach-spark',
    'Искра Машиаха',
    'В нашем индивидуальном Б-жественном пространстве раскроется собственная, глубоко запрятанная в нас искра Машиаха. Да удостоимся мы освободиться из нашего состояния духовного и физического изгнания.'
  );

  // Финальная оценка ПРАКТИКИ
  yield practiceRating();

  // Возвращаем результат
  return {
    rating: context.get('practice-final-rating')
  };
}

// Конфигурация практики
export const divineSpaceYichudPracticeConfig: PracticeConfig = {
  id: 'divine-space-yichud',
  title: 'Божественное пространство',
  description: 'Мы построим вокруг нас духовное святилище, осознавая шесть направлений пространства и соответствующие им виды сознания. Каждое направление соответствует определенному виду непрерывного сознания, как предписано соответствующей постоянной заповедью Торы.',
  
  hasStartScreen: true,
  startScreenContent: {
    title: 'Божественное пространство',
    description: 'Мы построим вокруг нас духовное святилище, осознавая шесть направлений пространства и соответствующие им виды сознания. Каждое направление соответствует определенному виду непрерывного сознания, как предписано соответствующей постоянной заповедью Торы.',
    duration: '25 мин',
    level: 'Продвинутый'
  },
  
  practiceFunction: divineSpaceYichudPractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'divine-space-yichud',
      title: 'Божественное пространство',
      route: '/practices/runner/divine-space-yichud',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined
    });

    console.log('Practice completed with result:', result);
  }
};