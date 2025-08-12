// Копия практики "Подъем МАН с конкретным запросом" для редактирования

import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { manBlocks } from './practice-blocks';

/**
 * Практика "Подъем МАН с конкретным запросом" (копия для редактирования)
 */
export async function* specificRequestPracticeCopy(context: PracticeContext) {
  // Начинаем с базовых блоков
  yield* manBlocks.feeling();
  
  // Определяем проблему
  yield* manBlocks.defineProblem();
  
  // Локализуем проблему
  yield* manBlocks.localizeProblem();
  
  // Самоотмена
  yield* manBlocks.selfCancellation('userProblem');
  
  // Находим других с такой же проблемой
  yield* manBlocks.findOthers();
  
  // Проводник света
  yield* manBlocks.conductLight();
  
  // Видение участников
  yield* manBlocks.seeParticipants();
  
  // Свет вместо тьмы
  yield* manBlocks.lightInsteadOfDarkness();
  
  // Соединение с собой
  yield* manBlocks.connectWithSelf();
  
  // Соединение всех участников
  yield* manBlocks.uniteAll();
  
  // Благодарность
  yield* manBlocks.gratitude();
  
  // Финальная оценка
  yield* manBlocks.finalRating();
}

// Функция для сохранения результата
async function saveSpecificRequestCopyResult(context: PracticeContext, result: any) {
  return {
    userProblem: context.get('userProblem'),
    rating: context.get('rating')
  };
}

// Конфигурация практики
export const specificRequestPracticeCopyConfig: PracticeConfig = {
  id: 'specific-request-copy',
  title: 'Подъем МАН с конкретным запросом V2',
  description: 'Это упражнение направлено на проработку конкретного запроса или проблемы через призму каббалистических знаний.',

  hasStartScreen: true,
  startScreenContent: {
    title: 'Подъем МАН с конкретным запросом V2',
    description: 'Это упражнение направлено на проработку конкретного запроса или проблемы через призму каббалистических знаний. Цель - получить ясное видение ситуации и найти пути ее разрешения.',
    duration: '25 мин',
    level: 'Продвинутый'
  },
  
  practiceFunction: specificRequestPracticeCopy,
  
  onFinish: async (context, result) => {
    const practiceRecord = {
      name: 'Подъем МАН с конкретным запросом V2',
      route: '/practices/runner/specific-request-copy',
      completedAt: new Date().toISOString(),
      result
    };
    
    localStorage.setItem('lastPractice', JSON.stringify(practiceRecord));
    console.log('Specific request copy practice completed with result:', result);
  }
};
