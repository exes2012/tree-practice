// Библиотека переиспользуемых блоков для практик

import { PracticeStep, PracticeContext } from '../models/practice-engine.types';

/**
 * Хелперы для создания шагов
 */

// Простой шаг с инструкцией
export function step(id: string, title: string, instruction: string): PracticeStep {
  return {
    id,
    title,
    instruction,
    type: 'simple'
  };
}

// Шаг с вводом данных
export function input(
  id: string,
  title: string,
  instruction: string,
  field: string,
  type: 'text' | 'textarea' | 'number' = 'textarea',
  placeholder?: string,
  initialValue?: any,
  isFinalStep: boolean = false
): PracticeStep {
  return {
    id,
    title,
    instruction,
    type: 'input',
    inputConfig: {
      field,
      type,
      placeholder,
      initialValue
    },
    ...(isFinalStep ? { isFinalStep: true } : {})
  };
}

// Шаг с радио-кнопками
export function radio(
  id: string,
  title: string,
  instruction: string,
  field: string,
  options: { value: any; label: string }[]
): PracticeStep {
  return {
    id,
    title,
    instruction,
    type: 'input',
    inputConfig: {
      field,
      type: 'radio',
      options
    }
  };
}

// Шаг с повторяемой фразой
export function repeat(
  id: string,
  title: string,
  instruction: string,
  phrase: string
): PracticeStep {
  return {
    id,
    title,
    instruction,
    type: 'repeat',
    repeatablePhrase: phrase,
    showToggleRepetition: true
  };
}

// Шаг с оценкой
export function rating(
  id: string,
  title: string,
  instruction: string,
  isFinal: boolean = false,
  min: number = 1,
  max: number = 10
): PracticeStep {
  return {
    id,
    title,
    instruction,
    type: 'rating',
    ratingConfig: {
      min,
      max,
      isFinal
    },
    isFinalStep: isFinal
  };
}

/**
 * Переиспользуемые блоки для МАН практик
 */
export const manBlocks = {
  // Базовое ощущение пространства
  async* feeling(): AsyncIterableIterator<PracticeStep> {
    yield step(
      'feeling',
      'Шаг 1: Ощущение',
      'Почувствуй пространство, себя, свое тело.'
    );
  },

  // Определение проблемы или цели
  async* defineProblem(placeholder: string = 'С чем бы ты хотел поработать?'): AsyncIterableIterator<PracticeStep> {
    yield input(
      'define-problem',
      'Шаг 2: Определение проблемы',
      'С чем бы ты хотел поработать?',
      'userProblem',
      'textarea',
      placeholder
    );
  },

  // Локализация проблемы
  async* localizeProblem(): AsyncIterableIterator<PracticeStep> {
    yield step(
      'localize-problem',
      'Шаг 3: Локализация проблемы',
      'Отметь, что включается в твоем внутреннем пространстве, когда ты думаешь о"{{userProblem}}". Любая наша реакция, которая включается, когда мы думаем о проблеме - неисправленное намерение внутри какого-то нашего желания. Осознай это.'
    );
  },

  // Самоотмена
  async* selfCancellation(problemField: string = 'userProblem'): AsyncIterableIterator<PracticeStep> {
    yield repeat(
      'self-cancellation',
      'Шаг 4: Самоотмена',
      'Удерживая внимания на том, что включается, поставь руку на грудную точку и проговаривай до состояния уменьшения важности и самоотмены:',
      `Мне не важно, решится ли "{{${problemField}}}", или нет. Мне нужна только связь с Творцом. И я здесь только для того, чтобы с ним соединиться через эту проблему.`
    );
  },

  // Поиск других с такой же проблемой
  async* findOthers(): AsyncIterableIterator<PracticeStep> {
    yield repeat(
      'find-others',
      'Шаг 5: Найдите других',
      'Попытайся почувствовать все души в общей системе, которые страдают от такой же проблемы. Скажи:',
      'Все души, у которых есть такая же проблема, отпечатаны во мне, связаны в одну общую систему. Я присоединяю к себе их желания и формирую одно общее желание для просьбы.'
    );
  },

  // Проводник света
  async* conductLight(): AsyncIterableIterator<PracticeStep> {
    yield repeat(
      'conduct-light',
      'Шаг 6: Проводник света',
      'Соединив все желания в единое целое, работай как проводник. Проси об исправлении намерения в общем желании и притягивай в исправленные сосуды благо и наслаждение.',
      'Творец, исправь намерение внутри нашего общего желания из получения ради себя в получение ради отдачи, ради тебя, приблизь нас к себе и наполни наши нехватки благом и наслаждением.'
    );
  },

  // Видение участников
  async* seeParticipants(): AsyncIterableIterator<PracticeStep> {
    yield step(
      'see-participants',
      'Шаг 7: Видение участников',
      'Попроси Творца показать, какие еще участники вовлечены в эту проблему. Есть ли кто-то еще, включенный в эту проблему? Просто подумай об этом и переходи к следующему шагу.'
    );
  },

  // Свет вместо тьмы
  async* lightInsteadOfDarkness(): AsyncIterableIterator<PracticeStep> {
    yield repeat(
      'light-instead-darkness',
      'Шаг 8: Свет вместо тьмы',
      'Почувствуй, что любое зло, любое страдание в людях это недостаток света. Тьмы не создано. Создан недостаток света. Попробуй включаться в других участников, в каждого по очереди. Почувствуй, какие нехватки у нихе сть. Работай с каждым человеком по очереди. Присоединяй его нехватки к себе, и проговаривай:',
      'Творец, исправь намерения внутри наших желаний и нехваток из получения ради себя в получение ради отдачи, ради тебя, приблизь нас к себе и наполни наши нехватки благом и наслаждением.'
    );
  },

  // Соединение с собой
  async* connectWithSelf(): AsyncIterableIterator<PracticeStep> {
    yield repeat(
      'connect-self',
      'Шаг 9: Соединение',
      'Отметь, осталась ли в тебе, какая-то реакция на проблему. Если да, ищи за ней нехватку, желание получать, и неисправленное намерение внутри него. Проси Творца исправить твое намерение на альтруистическое:',
      'Творец, исправь мое намерение, чтобы оно было ради связи, ради отдачи, ради Тебя.'
    );
  },

  // Соединение всех участников
  async* uniteAll(): AsyncIterableIterator<PracticeStep> {
    yield repeat(
      'unite-all',
      'Шаг 10: Соединение',
      'Почувствуй ещё раз всех участников, вовлечённых в эту проблему, все их сосуды. Собери все их сосуды воедино, как собрание всех душ. Включи их в себя. Скажи:',
      'Всё, что существует внутри этой системы, включая эту проблему — и есть Творец.'
    );
  },

  // Благодарность
  async* gratitude(): AsyncIterableIterator<PracticeStep> {
    yield step(
      'gratitude',
      'Шаг 11: Благодарность',
      'Вырази благодарность Творцу в меру получения облегчения и изменения. "Благодарю за это общение".'
    );
  },

  // Финальная оценка
  async* finalRating(): AsyncIterableIterator<PracticeStep> {
    yield rating(
      'final-rating',
      'Шаг 12: Оценка',
      'Во сколько баллов оценишь эту проработку?',
      true
    );
  }
};

/**
 * Блоки для работы с целями
 */
export const goalBlocks = {
  // Формулировка цели
  async* formulateGoal(): AsyncIterableIterator<PracticeStep> {
    yield input(
      'formulate-goal',
      'Шаг 2: Определение цели',
      'Какую цель ты бы хотел проработать?',
      'practiceFormulation',
      'textarea',
      'Опишите вашу цель...',
      '{{goal.title}}'
    );
  },

  // Видение достигнутой цели
  async* visionAfterGoal(): AsyncIterableIterator<PracticeStep> {
    yield input(
      'vision-after-goal',
      'Шаг 3: Видение достигнутой цели',
      'Представьте, что цель "{{goal.title}}" уже достигнута, что вы при этом видите?',
      'visionAfterAchievingGoal',
      'textarea',
      'Опишите ваше видение...'
    );
  },

  // Самоотмена для цели
  async* selfCancellationForGoal(): AsyncIterableIterator<PracticeStep> {
    yield repeat(
      'self-cancellation-goal',
      'Шаг 4: Самоотмена',
      'Положи руку туда, где находится это чувство. Одновременно с этим поставь руку на грудную точку, и проговаривай до состояния уменьшения важности и самоотмены:',
      'Мне не важно, будет ли достигнута "{{goal.title}}". Мне нужна только связь с Творцом. И я здесь только для того, чтобы с Ним соединиться через эту цель.'
    );
  },

  // Поиск других душ с той же целью
  async* findOthersWithGoal(): AsyncIterableIterator<PracticeStep> {
    yield repeat(
      'find-others-goal',
      'Шаг 5: Найдите других',
      'Попытайся почувствовать все души в общей системе, которые страдают от не достижения этой цели. Скажи:',
      'Все души, которые страдают от недостижения этой цели, отпечатаны во мне. Мы связаны в одну общую систему. Их страдание — это выражение их желания, пока ещё с эгоистическим расчётом.'
    );
  }
};

/**
 * Функции для создания линейных практик
 */
export function createLinearPractice(steps: PracticeStep[]): (context: PracticeContext) => AsyncIterableIterator<PracticeStep> {
  return async function* (context: PracticeContext): AsyncIterableIterator<PracticeStep> {
    for (const step of steps) {
      yield step;
    }
  };
}

/**
 * Функция для объединения блоков
 */
export async function* combineBlocks(
  ...blocks: AsyncIterableIterator<PracticeStep>[]
): AsyncIterableIterator<PracticeStep> {
  for (const block of blocks) {
    yield* block;
  }
}

// Шаг с выбором (старая версия для обратной совместимости)
export function choice(
  id: string,
  title: string,
  instruction: string,
  choices: Array<{ text: string; value: string; nextStep?: string }>
): PracticeStep {
  return {
    id,
    title,
    instruction,
    type: 'choice',
    inputConfig: {
      field: id,
      type: 'choice',
      choices
    }
  };
}

// Простая функция для шагов с кастомными кнопками
export function stepWithButtons(
  id: string,
  title: string,
  instruction: string,
  buttons: Array<{
    text: string;
    value: string;
    targetStepId: string;
    saveValue?: boolean;
  }>
): PracticeStep {
  return {
    id,
    title,
    instruction,
    type: 'simple',
    customButtons: buttons
  };
}