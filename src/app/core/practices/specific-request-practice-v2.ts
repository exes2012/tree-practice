// Пример портирования specific-request практики на новую архитектуру

import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { manBlocks } from './practice-blocks';
import { GoalService } from '../services/goal.service';
import { PracticeService } from '../services/practice.service';
import { Router } from '@angular/router';

/**
 * Практика "Подъем МАН с конкретным запросом" в новой архитектуре
 */
export async function* specificRequestPracticeV2(context: PracticeContext) {
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
  
  // Свет вместо тьмы (всегда включаем в поток)
  yield* manBlocks.lightInsteadOfDarkness();
  
  // Соединение с собой
  yield* manBlocks.connectWithSelf();
  
  // Соединение всех участников
  yield* manBlocks.uniteAll();
  
  // Благодарность
  yield* manBlocks.gratitude();
  
  // Финальная оценка
  yield* manBlocks.finalRating();
  
  // Возвращаем результат
  return {
    userProblem: context.get('userProblem'),
    rating: context.get('rating')
  };
}

// Конфигурация практики
export const specificRequestPracticeV2Config: PracticeConfig = {
  id: 'specific-request',
  title: 'Подъем МАН с конкретным запросом',
  description: 'Это упражнение направлено на проработку конкретного запроса или проблемы через призму каббалистических знаний.',
  
  hasStartScreen: true,
  startScreenContent: {
    title: 'Подъем МАН с конкретным запросом',
    description: 'Это упражнение направлено на проработку конкретного запроса или проблемы через призму каббалистических знаний. Цель - получить ясное видение ситуации и найти пути ее разрешения.',
    duration: '25 мин',
    level: 'Продвинутый'
  },
  
  practiceFunction: specificRequestPracticeV2,
  
  onFinish: async (context, result) => {
    // Можно инжектить сервисы через DI или передавать в контексте
    // Пока упрощенная версия - сохраняем в localStorage
    const practiceRecord = {
      name: 'Подъем МАН с конкретным запросом',
      route: '/practices/runner/specific-request',
      completedAt: new Date().toISOString(),
      result
    };
    
    localStorage.setItem('lastPractice', JSON.stringify(practiceRecord));
    
    console.log('Practice completed with result:', result);
  }
};