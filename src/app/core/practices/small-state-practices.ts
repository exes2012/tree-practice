import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { step, rating, stepWithButtons, practiceRating } from './practice-blocks';

/**
 * Практика "Пространство с Творцом" на движке раннера
 */
export async function* creatorSpacePractice(context: PracticeContext) {
  // Шаг 1: Пространство
  yield step(
    'space-awareness',
    'Шаг 1: Пространство',
    'Почувствуй пространство, себя и свое тело.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 2: Перед тобой
  yield step(
    'space-front',
    'Шаг 2: Перед тобой',
    'Отметь пространство перед тобой и себя. Удерживай это состояние на протяжении 30 секунд.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 3: Позади тебя
  yield step(
    'space-back',
    'Шаг 3: Позади тебя',
    'Отметь пространство позади себя и себя. Удерживай это состояние на протяжении 30 секунд.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 4: Слева
  yield step(
    'space-left',
    'Шаг 4: Слева',
    'Отметь пространство слева от себя и себя. Удерживай это состояние на протяжении 30 секунд.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 5: Справа
  yield step(
    'space-right',
    'Шаг 5: Справа',
    'Отметь пространство справа от себя и себя. Удерживай это состояние на протяжении 30 секунд.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 6: Сверху
  yield step(
    'space-above',
    'Шаг 6: Сверху',
    'Отметь пространство сверху от себя и себя. Удерживай это состояние на протяжении 30 секунд.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 7: Снизу
  yield step(
    'space-below',
    'Шаг 7: Снизу',
    'Отметь пространство снизу от себя и себя. Удерживай это состояние на протяжении 30 секунд.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 8: Куб
  yield step(
    'space-cube',
    'Шаг 8: Куб',
    'Отметь все пространства одновременно, и себя внутри, формируя куб. Удерживай это состояние на протяжении 30 секунд.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 9: Вопрос к Творцу
  yield step(
    'find-creator',
    'Шаг 9: Вопрос к Творцу',
    'Удерживая пространство вниманием найди в этом пространстве Творца на протяжении 5 минут.',
    'simple',
    {
      autoTimer: {
        duration: 300, // 5 минут
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 10: Единение
  yield step(
    'unity',
    'Шаг 10: Единение',
    'Удерживая пространство вниманием страстно желай прилепиться к Творцу и остаться в состоянии прилепления навечно. Сокращай все мысли, отрывающие тебя от единства с Ним.',
    'simple'
  );

  // Финальная оценка ПРАКТИКИ
  yield practiceRating();
}

/**
 * Конфигурация практики "Пространство с Творцом"
 */
export const creatorSpacePracticeConfig: PracticeConfig = {
  id: 'small-state-creator-space',
  title: 'Пространство с Творцом',
  description: 'Это упражнение направлено на формирование ощущения пространства и единства с Творцом через удержание внимания на шести направлениях.',
  
  hasStartScreen: true,
  startScreenContent: {
    title: 'Пространство с Творцом',
    description: 'Это упражнение направлено на формирование ощущения пространства и единства с Творцом через удержание внимания на шести направлениях.',
    duration: '~10 минут',
    level: 'Средний'
  },
  
  practiceFunction: creatorSpacePractice,
  
  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'small-state-creator-space',
      title: 'Пространство с Творцом',
      route: '/practices/runner/small-state-creator-space',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined
    });

    console.log('Practice completed with result:', result);
  }
};

/**
 * Практика "Пространство Зеир Анпина" на движке раннера
 */
export async function* zeirAnpinSpacePractice(context: PracticeContext) {
  // Шаг 1: Пространство
  yield step(
    'space-awareness',
    'Шаг 1: Пространство',
    'Почувствуй пространство, себя и свое тело.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 2: Сфира Нецах
  yield step(
    'sefira-netzach',
    'Шаг 2: Сфира Нецах',
    'Отметь пространство сверху. Это сфира Нэцах. Вера в существование Бога. Удерживай это состояние на протяжении 30 секунд.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 3: Сфира Ход
  yield step(
    'sefira-hod',
    'Шаг 3: Сфира Ход',
    'Отметь пространство снизу. Это сфира Ход. Отказ от идолопоклонства. Удерживай это состояние на протяжении 30 секунд.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 4: Сфира Есод
  yield step(
    'sefira-yesod',
    'Шаг 4: Сфира Есод',
    'Отметь пространство позади себя. Это сфира Есод. Охрана разума от нечистых мыслей. Удерживай это состояние на протяжении 30 секунд.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 5: Сфира Хесед
  yield step(
    'sefira-chesed',
    'Шаг 5: Сфира Хесед',
    'Отметь пространство справа от себя. Это сфира Хесэд. Любовь к Богу. Удерживай это состояние на протяжении 30 секунд.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 6: Сфира Гвура
  yield step(
    'sefira-gevurah',
    'Шаг 6: Сфира Гвура',
    'Отметь пространство слева от себя. Это сфира Гвура. Трепет перед Творцом. Удерживай это состояние на протяжении 30 секунд.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 7: Сфира Тиферет
  yield step(
    'sefira-tiferet',
    'Шаг 7: Сфира Тиферет',
    'Отметь пространство перед тобой. Это сфира Тифэрэт. Вера в единство Бога. Удерживай это состояние на протяжении 30 секунд.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 8: Куб
  yield step(
    'space-cube',
    'Шаг 8: Куб',
    'Отметь все пространства одновременно, и себя как Малхут внутри них, формируя куб. Удерживай это состояние на протяжении 30 секунд.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 9: Найти Творца
  yield step(
    'find-creator',
    'Шаг 9: Найти Творца',
    'Найди в этом пространстве Творца на протяжении 5 минут.',
    'simple',
    {
      autoTimer: {
        duration: 300, // 5 минут
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 10: Единение
  yield step(
    'unity',
    'Шаг 10: Единение',
    'Оставайся с Творцом в пространстве Зэир Анпина. Сокращай все мысли, отрывающие тебя от единства с Ним.',
    'simple'
  );

  // Финальная оценка ПРАКТИКИ
  yield practiceRating();
}

/**
 * Конфигурация практики "Пространство Зеир Анпина"
 */
export const zeirAnpinSpacePracticeConfig: PracticeConfig = {
  id: 'small-state-zeir-anpin-space',
  title: 'Пространство Зеир Анпина',
  description: 'Это упражнение помогает построить "малый лик" (Зеир Анпин) через соотнесение шести направлений с соответствующими сфирот и их принципами.',

  hasStartScreen: true,
  startScreenContent: {
    title: 'Пространство Зеир Анпина',
    description: 'Это упражнение помогает построить "малый лик" (Зеир Анпин) через соотнесение шести направлений с соответствующими сфирот и их принципами.',
    duration: '~10 минут',
    level: 'Средний'
  },

  practiceFunction: zeirAnpinSpacePractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'small-state-zeir-anpin-space',
      title: 'Пространство Зеир Анпина',
      route: '/practices/runner/small-state-zeir-anpin-space',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined
    });

    console.log('Practice completed with result:', result);
  }
};

/**
 * Практика "Средняя линия Нецах/Ход" на движке раннера
 */
export async function* netzHodLinePractice(context: PracticeContext) {
  // Шаг выбора потока
  yield stepWithButtons(
    'stream-selection',
    'Выбор потока',
    'Какой поток вы хотите наработать?',
    [
      {
        text: 'В отношении Творца',
        value: 'creator',
        targetStepId: 'space-awareness',
        saveValue: true
      },
      {
        text: 'В отношении себя',
        value: 'self',
        targetStepId: 'space-awareness',
        saveValue: true
      },
      {
        text: 'В отношении других',
        value: 'others',
        targetStepId: 'space-awareness',
        saveValue: true
      }
    ]
  );

  // Получаем выбранный поток из контекста
  const selectedStream = context.get('stream-selection') || 'creator';

  // Шаг 1. Построение пространства (общий для всех потоков)
  yield step(
    'space-awareness',
    'Шаг 1. Построение пространства',
    'Почувствуй пространство, себя и свое тело в этом пространстве.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 2. Сфира Нецах (общий)
  yield step(
    'netzach-space',
    'Шаг 2. Сфира Нецах',
    'Почувствуй пространство над тобой. Это сфира Нецах.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 3. Сфира Нецах - работа (зависит от потока)
  const netzachInstructions = {
    creator: 'Сконцентрируйся на вере в единого Бога (отдача). Выстрой намерение навечно прилепиться к нему. И прикладывай стремление к своему намерению.',
    self: 'Почувствуй свои внутренние недостатки. Проявляй упорство и внутреннюю выносливость, стремясь к Творцу снизу вверх и прося Творца исправить твои сосуды.',
    others: 'Проси творца дать тебе сосуды, позволяющие вдохновлять других своей настойчивостью и верой на преодоление трудностей.'
  };

  yield step(
    'netzach-work',
    'Шаг 3. Сфира Нецах',
    netzachInstructions[selectedStream as keyof typeof netzachInstructions],
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 4. Сфира Ход (общий)
  yield step(
    'hod-space',
    'Шаг 4. Сфира Ход',
    'Почувствуй пространство под тобой. Это сфира Ход.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 5. Сфира Ход - работа (зависит от потока)
  const hodInstructions = {
    creator: 'Отталкивай от себя все мысли, говорящие об отсутствии единства. И о том, что есть что-то в этом мире, не являющееся Творцом.',
    self: 'Сконцентрируйся на принятии своего текущего места в системе мироздания. Согласись с управлением Творца. Что есть, то и хорошо.',
    others: 'Сконцентрируйся на том, чтобы стать для других примером смирения и благодарности. Проси Творца дать тебе такие келим.'
  };

  yield step(
    'hod-work',
    'Шаг 5. Сфира Ход',
    hodInstructions[selectedStream as keyof typeof hodInstructions],
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 6. Нецах/Ход - основная медитация (зависит от потока)
  const combinedInstructions = {
    creator: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Веру в единого Бога и стремление к нему (пространство над тобой).<br><br>2. Отталкивание мыслей об отсутствии единства (пространство под тобой).<br><br>Удерживай себя, свое тело и эти два состояния.',
    self: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Упорство в просьбе исправить твои сосуды (пространство над тобой).<br><br>2. Принятие своего места и управления Творца (пространство под тобой).<br><br>Удерживай себя, свое тело и эти два состояния.',
    others: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Просьба о сосудах для вдохновения других (пространство над тобой).<br><br>2. Просьба стать примером смирения и благодарности (пространство под тобой).<br><br>Прикладывай стремление.'
  };

  yield step(
    'netzach-hod-combined',
    'Шаг 6. Нецах/Ход',
    combinedInstructions[selectedStream as keyof typeof combinedInstructions],
    'simple',
    {
      autoTimer: {
        duration: 300, // 5 минут - ОСНОВНОЙ ТАЙМЕР НА ШАГЕ 6
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Финальная оценка ПРАКТИКИ
  yield practiceRating();
}

/**
 * Практика "Средняя линия Хесед/Гвура" на движке раннера
 */
export async function* hesedGevurahLinePractice(context: PracticeContext) {
  // Шаг выбора потока
  yield stepWithButtons(
    'stream-selection',
    'Выбор потока',
    'Какой поток вы хотите наработать?',
    [
      {
        text: 'В отношении Творца',
        value: 'creator',
        targetStepId: 'space-awareness',
        saveValue: true
      },
      {
        text: 'В отношении себя',
        value: 'self',
        targetStepId: 'space-awareness',
        saveValue: true
      },
      {
        text: 'В отношении других',
        value: 'others',
        targetStepId: 'space-awareness',
        saveValue: true
      }
    ]
  );

  // Получаем выбранный поток из контекста
  const selectedStream = context.get('stream-selection') || 'creator';

  // Шаг 1. Построение пространства (общий для всех потоков)
  yield step(
    'space-awareness',
    'Шаг 1. Построение пространства',
    'Почувствуй пространство, себя и свое тело в этом пространстве.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 2. Сфира Хесед (общий)
  yield step(
    'hesed-space',
    'Шаг 2. Сфира Хесед',
    'Почувствуй пространство справа от тебя.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 3. Сфира Хесед - работа (зависит от потока)
  const hesedInstructions = {
    creator: 'Сконцентрируйся на состоянии безграничной любви к Творцу и стремлении к слиянию с Ним по свойствам.',
    self: 'Сконцентрируйся на проявлении безусловного милосердия и принятия в отношении себя и своих недостатков.',
    others: 'Сконцентрируйся на проявлении безусловного милосердия в отношении окружающих.'
  };

  yield step(
    'hesed-work',
    'Шаг 3. Сфира Хесед',
    hesedInstructions[selectedStream as keyof typeof hesedInstructions],
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 4. Сфира Гвура (общий)
  yield step(
    'gevurah-space',
    'Шаг 4. Сфира Гвура',
    'Почувствуй пространство слева.',
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 5. Сфира Гвура - работа (зависит от потока)
  const gevurahInstructions = {
    creator: 'Сконцентрируйся на Трепете перед Творцом. И страхе потерять с Ним связь.',
    self: 'Сконцентрируйся на сознательном ограничении и преодолении своих эгоистических устремлений.',
    others: 'Сконцентрируйся на проявлении справедливости и установке необходимых границ для истинного блага других.'
  };

  yield step(
    'gevurah-work',
    'Шаг 5. Сфира Гвура',
    gevurahInstructions[selectedStream as keyof typeof gevurahInstructions],
    'simple',
    {
      autoTimer: {
        duration: 30,
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Шаг 6. Хесед/Гвура - основная медитация (зависит от потока)
  const combinedInstructions = {
    creator: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Безграничную любовь к Творцу (пространство справа).<br><br>2. Трепет перед Ним и страх потерять связь (пространство слева).<br><br>Удерживай себя, свое тело и эти два состояния.',
    self: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Безусловное милосердие к себе (пространство справа).<br><br>2. Сознательное ограничение эгоизма (пространство слева).<br><br>Удерживай себя, свое тело и эти два состояния.',
    others: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Безусловное милосердие к другим (пространство справа).<br><br>2. Справедливость и установка границ (пространство слева).<br><br>Удерживай себя, свое тело и эти два состояния.'
  };

  yield step(
    'hesed-gevurah-combined',
    'Шаг 6. Хесед/Гвура',
    combinedInstructions[selectedStream as keyof typeof combinedInstructions],
    'simple',
    {
      autoTimer: {
        duration: 300, // 5 минут - ОСНОВНОЙ ТАЙМЕР НА ШАГЕ 6
        autoAdvance: true,
        showCountdown: true
      }
    }
  );

  // Финальная оценка ПРАКТИКИ
  yield practiceRating();
}

/**
 * Конфигурация практики "Средняя линия Хесед/Гвура"
 */
export const hesedGevurahLinePracticeConfig: PracticeConfig = {
  id: 'small-state-hesed-gevurah-line',
  title: 'Средняя линия Хесед/Гвура',
  description: 'Эта практика помогает сбалансировать любовь (Хесед) и строгость (Гвура) в различных аспектах жизни.',

  hasStartScreen: true,
  startScreenContent: {
    title: 'Средняя линия Хесед/Гвура',
    description: 'Эта практика помогает сбалансировать любовь (Хесед) и строгость (Гвура) в различных аспектах жизни.',
    duration: '~10 минут',
    level: 'Средний'
  },

  practiceFunction: hesedGevurahLinePractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'small-state-hesed-gevurah-line',
      title: 'Средняя линия Хесед/Гвура',
      route: '/practices/runner/small-state-hesed-gevurah-line',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined
    });

    console.log('Practice completed with result:', result);
  }
};

/**
 * Конфигурация практики "Средняя линия Нецах/Ход"
 */
export const netzHodLinePracticeConfig: PracticeConfig = {
  id: 'small-state-netz-hod-line',
  title: 'Средняя линия Нецах/Ход',
  description: 'Эта практика помогает сбалансировать веру (Нецах) и смирение (Ход) в различных аспектах жизни.',

  hasStartScreen: true,
  startScreenContent: {
    title: 'Средняя линия Нецах/Ход',
    description: 'Эта практика помогает сбалансировать веру (Нецах) и смирение (Ход) в различных аспектах жизни.',
    duration: '~10 минут',
    level: 'Средний'
  },

  practiceFunction: netzHodLinePractice,

  onFinish: async (context, result) => {
    // Save practice run to IndexedDB
    const { JournalService } = await import('../services/journal.service');
    const { dateToLocalDateKey } = await import('../services/db.service');

    const completedAt = new Date().toISOString();
    const dateKey = dateToLocalDateKey(new Date());

    const journal = new JournalService();
    await journal.savePracticeRun({
      practiceId: 'small-state-netz-hod-line',
      title: 'Средняя линия Нецах/Ход',
      route: '/practices/runner/small-state-netz-hod-line',
      completedAt,
      dateKey,
      rating: context.get('practice-final-rating') as number | undefined,
      duration: result.duration as number | undefined
    });

    console.log('Practice completed with result:', result);
  }
};
