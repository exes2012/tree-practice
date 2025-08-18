import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { intentionStep } from './practice-blocks';

// Общая функция для сохранения в журнал
async function saveIntentionExercise(
  practiceId: string,
  title: string,
  context: PracticeContext,
  result: any
) {
  const { JournalService } = await import('../services/journal.service');
  const { dateToLocalDateKey } = await import('../services/db.service');

  const completedAt = new Date().toISOString();
  const dateKey = dateToLocalDateKey(new Date());

  const journal = new JournalService();
  await journal.savePracticeRun({
    practiceId,
    title,
    route: `/practices/runner/${practiceId}`,
    completedAt,
    dateKey,
    duration: result.duration as number | undefined,
  });
}

// Общая функция onFinish для упражнений намерения
function handleIntentionFinish(title: string, description: string, practiceId: string) {
  return async (context: PracticeContext, result: any) => {
    const action = context.get('intention-exercise');
    console.log('Intention exercise onFinish:', { action, title, practiceId });

    if (action === 'set_as_challenge') {
      // Устанавливаем как намерение дня
      const challenge = {
        title,
        description,
      };
      localStorage.setItem('dailyChallenge', JSON.stringify(challenge));
      console.log('Set as daily challenge:', challenge);
    }

    await saveIntentionExercise(practiceId, title, context, result);
  };
}

// 1. Вечный контакт
export async function* eternalContactPractice(context: PracticeContext) {
  yield intentionStep(
    'intention-exercise',
    'Вечный контакт',
    'В течении дня во время любой работы или размышления представляй, будто это твоё последнее и вечное состояние. Вызови в себе сильнейшую страсть навечно остаться в этом контакте с Творцом.'
  );

  return { action: context.get('intention-exercise') };
}

export const eternalContactPracticeConfig: PracticeConfig = {
  id: 'eternal-contact',
  title: 'Вечный контакт',
  hasStartScreen: false,
  practiceFunction: eternalContactPractice,
  onFinish: handleIntentionFinish(
    'Вечный контакт',
    'В течении дня во время любой работы или размышления представляй, будто это твоё последнее и вечное состояние. Вызови в себе сильнейшую страсть навечно остаться в этом контакте с Творцом.',
    'eternal-contact'
  ),
};

// 2. Отмена страха
export async function* cancelFearPractice(context: PracticeContext) {
  yield intentionStep(
    'intention-exercise',
    'Отмена страха',
    'В течении дня любой возникающий физический страх, тревогу, беспокойство переноси на страх перед Небом. Страх оторваться от Творца. Почувствуй его отчётливо внутри себя.'
  );

  return { action: context.get('intention-exercise') };
}

export const cancelFearPracticeConfig: PracticeConfig = {
  id: 'cancel-fear',
  title: 'Отмена страха',
  hasStartScreen: false,
  practiceFunction: cancelFearPractice,
  onFinish: handleIntentionFinish(
    'Отмена страха',
    'В течении дня любой возникающий физический страх, тревогу, беспокойство переноси на страх перед Небом. Страх оторваться от Творца. Почувствуй его отчётливо внутри себя.',
    'cancel-fear'
  ),
};

// 3. Преобразование любви
export async function* transformLovePractice(context: PracticeContext) {
  yield intentionStep(
    'intention-exercise',
    'Преобразование любви',
    'В течении дня любую любовь к материальному переноси на любовь к Всевышнему. Представляй ярко и детально.'
  );

  return { action: context.get('intention-exercise') };
}

export const transformLovePracticeConfig: PracticeConfig = {
  id: 'transform-love',
  title: 'Преобразование любви',
  hasStartScreen: false,
  practiceFunction: transformLovePractice,
  onFinish: handleIntentionFinish(
    'Преобразование любви',
    'В течении дня любую любовь к материальному переноси на любовь к Всевышнему. Представляй ярко и детально.',
    'transform-love'
  ),
};

// 4. Совершенство
export async function* perfectionPractice(context: PracticeContext) {
  yield intentionStep(
    'intention-exercise',
    'Совершенство',
    'В течении дня останавливайся и представляй себя совершенно совершенным и уверенным в связи с Творцом.'
  );

  return { action: context.get('intention-exercise') };
}

export const perfectionPracticeConfig: PracticeConfig = {
  id: 'perfection',
  title: 'Совершенство',
  hasStartScreen: false,
  practiceFunction: perfectionPractice,
  onFinish: handleIntentionFinish(
    'Совершенство',
    'В течении дня останавливайся и представляй себя совершенно совершенным и уверенным в связи с Творцом.',
    'perfection'
  ),
};

// 5. Настрой в изучении Торы
export async function* torahStudyPractice(context: PracticeContext) {
  yield intentionStep(
    'intention-exercise',
    'Настрой в изучении Торы',
    'В течении дня представляй, что Всевышний страстно желает раскрыть тебе тайны Торы. Почувствуй сильное желание постичь тайны Торы, визуализируя, как ты соединяешься с Творцом через них.'
  );

  return { action: context.get('intention-exercise') };
}

export const torahStudyPracticeConfig: PracticeConfig = {
  id: 'torah-study',
  title: 'Настрой в изучении Торы',
  hasStartScreen: false,
  practiceFunction: torahStudyPractice,
  onFinish: handleIntentionFinish(
    'Настрой в изучении Торы',
    'В течении дня представляй, что Всевышний страстно желает раскрыть тебе тайны Торы. Почувствуй сильное желание постичь тайны Торы, визуализируя, как ты соединяешься с Творцом через них.',
    'torah-study'
  ),
};

// 6. Собака пастуха
export async function* shepherdDogPractice(context: PracticeContext) {
  yield intentionStep(
    'intention-exercise',
    'Собака пастуха',
    'В течении дня заметив тягу к физическим удовольствиям, осознай её как «собаку». Переориентируй эту страсть на получение духовного Света. Визуализируй духовное наслаждение, чтобы удержать себя от соблазнов материального.'
  );

  return { action: context.get('intention-exercise') };
}

export const shepherdDogPracticeConfig: PracticeConfig = {
  id: 'shepherd-dog',
  title: 'Собака пастуха',
  hasStartScreen: false,
  practiceFunction: shepherdDogPractice,
  onFinish: handleIntentionFinish(
    'Собака пастуха',
    'В течении дня заметив тягу к физическим удовольствиям, осознай её как «собаку». Переориентируй эту страсть на получение духовного Света. Визуализируй духовное наслаждение, чтобы удержать себя от соблазнов материального.',
    'shepherd-dog'
  ),
};

// 7. Быть перед Творцом
export async function* beforeCreatorPractice(context: PracticeContext) {
  yield intentionStep(
    'intention-exercise',
    'Быть перед Творцом',
    'В течении дня приучись представлять, что стоишь перед Творцом. Представляй, что каждое твоё действие является поручением от Творца.'
  );

  return { action: context.get('intention-exercise') };
}

export const beforeCreatorPracticeConfig: PracticeConfig = {
  id: 'before-creator',
  title: 'Быть перед Творцом',
  hasStartScreen: false,
  practiceFunction: beforeCreatorPractice,
  onFinish: handleIntentionFinish(
    'Быть перед Творцом',
    'В течении дня приучись представлять, что стоишь перед Творцом. Представляй, что каждое твоё действие является поручением от Творца.',
    'before-creator'
  ),
};

// 8. Буквы имени АВАЯ
export async function* avayaLettersPractice(context: PracticeContext) {
  yield intentionStep(
    'intention-exercise',
    'Буквы имени АВАЯ',
    'В течении дня визуализируй ярко, как буквы Его имени АВАЯ пылают перед тобой.<br>Делай это при отвлечении на материальные мысли, чтобы удержать себя в святости.'
  );

  return { action: context.get('intention-exercise') };
}

export const avayaLettersPracticeConfig: PracticeConfig = {
  id: 'avaya-letters',
  title: 'Буквы имени АВАЯ',
  hasStartScreen: false,
  practiceFunction: avayaLettersPractice,
  onFinish: handleIntentionFinish(
    'Буквы имени АВАЯ',
    'В течении дня визуализируй ярко, как буквы Его имени АВАЯ пылают перед тобой.\nДелай это при отвлечении на материальные мысли, чтобы удержать себя в святости.',
    'avaya-letters'
  ),
};

// 9. Величие праведников
export async function* righteousGreatnessaPractice(context: PracticeContext) {
  yield intentionStep(
    'intention-exercise',
    'Величие праведников',
    'В течении дня сознательно визуализируй величие праведников, передавших тебе Тору.<br>Почувствуй, как это увеличивает твой сосуд желания постичь тайны Торы.'
  );

  return { action: context.get('intention-exercise') };
}

export const righteousGreatnessaPracticeConfig: PracticeConfig = {
  id: 'righteous-greatness',
  title: 'Величие праведников',
  hasStartScreen: false,
  practiceFunction: righteousGreatnessaPractice,
  onFinish: handleIntentionFinish(
    'Величие праведников',
    'В течении дня сознательно визуализируй величие праведников, передавших тебе Тору.\nПочувствуй, как это увеличивает твой сосуд желания постичь тайны Торы.',
    'righteous-greatness'
  ),
};

// 10. Ощущение опустошения
export async function* emptinessFeelPractice(context: PracticeContext) {
  yield intentionStep(
    'intention-exercise',
    'Ощущение опустошения',
    'В течении дня в моменты опустошения не беги от него, а сразу страстно пожелай наполнить пустоту Светом Творца.<br>Укрепляйся стремлением вне себя при первых признаках «вечера» (спада).'
  );

  return { action: context.get('intention-exercise') };
}

export const emptinessFeelPracticeConfig: PracticeConfig = {
  id: 'emptiness-feel',
  title: 'Ощущение опустошения',
  hasStartScreen: false,
  practiceFunction: emptinessFeelPractice,
  onFinish: handleIntentionFinish(
    'Ощущение опустошения',
    'В течении дня в моменты опустошения не беги от него, а сразу страстно пожелай наполнить пустоту Светом Творца.\nУкрепляйся стремлением вне себя при первых признаках «вечера» (спада).',
    'emptiness-feel'
  ),
};

// 11. Нет никого кроме Него
export async function* noneButHimPractice(context: PracticeContext) {
  yield intentionStep(
    'intention-exercise',
    'Нет никого кроме Него',
    'В течении дня представляй, что все, что тебя окружает - это Творец. Добейся ощущения единства всего. Отталкивай от себя мысли, говорящие об отсутствии единства.'
  );

  return { action: context.get('intention-exercise') };
}

export const noneButHimPracticeConfig: PracticeConfig = {
  id: 'none-but-him',
  title: 'Нет никого кроме Него',
  hasStartScreen: false,
  practiceFunction: noneButHimPractice,
  onFinish: handleIntentionFinish(
    'Нет никого кроме Него',
    'В течении дня представляй, что все, что тебя окружает - это Творец. Добейся ощущения единства всего. Отталкивай от себя мысли, говорящие об отсутствии единства.',
    'none-but-him'
  ),
};

// 12. Стол перед Всевышним
export async function* tableBeforeGodPractice(context: PracticeContext) {
  yield intentionStep(
    'intention-exercise',
    'Стол перед Всевышним',
    'В течении дня На каждой трапезе представь, что сидишь за столом перед Царём.<br>Ешь, сохраняя трепет и благодарность за пищу как за подарок от Него.'
  );

  return { action: context.get('intention-exercise') };
}

export const tableBeforeGodPracticeConfig: PracticeConfig = {
  id: 'table-before-god',
  title: 'Стол перед Всевышним',
  hasStartScreen: false,
  practiceFunction: tableBeforeGodPractice,
  onFinish: handleIntentionFinish(
    'Стол перед Всевышним',
    'В течении дня На каждой трапезе представь, что сидишь за столом перед Царём.\nЕшь, сохраняя трепет и благодарность за пищу как за подарок от Него.',
    'table-before-god'
  ),
};

// 13. Управление мыслью
export async function* thoughtControlPractice(context: PracticeContext) {
  yield intentionStep(
    'intention-exercise',
    'Управление мыслью',
    'В течени дня научи себя удерживать чистую мысль о Всевышнем (начни с часа в день). Наказывай себя за отвлечения, приучи тело бояться ненужных мыслей.'
  );

  return { action: context.get('intention-exercise') };
}

export const thoughtControlPracticeConfig: PracticeConfig = {
  id: 'thought-control',
  title: 'Управление мыслью',
  hasStartScreen: false,
  practiceFunction: thoughtControlPractice,
  onFinish: handleIntentionFinish(
    'Управление мыслью',
    'В течени дня научи себя удерживать чистую мысль о Всевышнем (начни с часа в день). Наказывай себя за отвлечения, приучи тело бояться ненужных мыслей.',
    'thought-control'
  ),
};
