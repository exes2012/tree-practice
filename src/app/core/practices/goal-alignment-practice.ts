// Практика "Сонастройка цели с Творцом"

import { PracticeContext, PracticeConfig } from '../models/practice-engine.types';
import { step, input, repeat, rating, choice, stepWithButtons } from './practice-blocks';

/**
 * Практика "Сонастройка цели с Творцом"
 */
export async function* goalAlignmentPractice(context: PracticeContext) {
  // Шаг 1: Ощущение
  yield step(
    'feeling',
    'Шаг 1: Ощущение',
    'Почувствуй пространство, себя, свое тело.'
  );
  
  // Шаг 2: Определение цели
  yield input(
    'goal-definition',
    'Шаг 2: Определение цели',
    'Какую цель ты бы хотел проработать?',
    'practiceFormulation',
    'textarea',
    'Введите вашу цель...'
  );
  
  // Шаг 3: Видение достигнутой цели
  yield input(
    'vision-after-goal',
    'Шаг 3: Видение достигнутой цели',
    'Представьте, что цель "{{practiceFormulation}}" уже достигнута, что вы при этом видите?',
    'visionAfterAchievingGoal',
    'textarea',
    'Опишите ваше видение...'
  );
  
  // Шаг 4: Настройка на отдачу
  yield step(
    'tuning-to-bestowal',
    'Шаг 4: Настройка на отдачу',
    'Настройтесь на наслаждение от свойства отдачи. Выполните поочередно стадии Кетер, Хохма и Бина. Найдите за наслаждением от свойства отдачи Творца и его отношение к Вам.'
  );
  
  // Шаг 5: Сравнение ощущений и оценка
  yield input(
    'alignment-rating',
    'Шаг 5: Сравнение ощущений',
    'Сравните ваше ощущение от уже достигнутой цели с ощущением благодарности и желания насладить Творца. Оцените от 1 до 10, насколько они совпадают.',
    'alignmentRating',
    'number',
    undefined,
    5
  );
  
  // Шаг 6: Переформулировка цели
  yield input(
    'goal-refinement',
    'Шаг 6: Переформулировка цели',
    'Как бы вы могли переформулировать цель, чтобы Творец притягивал от вас на 10 из 10?',
    'rephrasedGoal',
    'textarea',
    'Переформулируйте вашу цель...'
  );
  
  // Шаг 7: Новое видение
  yield input(
    'new-vision',
    'Шаг 7: Новое видение',
    'Представьте, что цель в ее новой формулировке уже достигнута, что вы при этом видите?',
    'newVisionAfterGoal',
    'textarea',
    'Опишите новое видение...'
  );
  
  // Шаг 8: Повторная оценка
  yield input(
    'new-alignment-rating',
    'Шаг 8: Повторная оценка',
    'Сравните ваше новое ощущение от достигнутой цели с ощущением благодарности и желания насладить Творца. Оцените от 1 до 10.',
    'finalAlignmentRating',
    'number',
    undefined,
    5
  );
  
  // Шаг 9: Вопрос об обновлении цели
  yield stepWithButtons(
    'goal-update-choice',
    'Шаг 9: Обновление цели',
    'Желаете ли вы перезаписать первоначальную формулировку цели на текущую сформулированную?',
    [
      {
        text: 'Да, обновить цель',
        value: 'true',
        targetStepId: 'final-rating',
        saveValue: true
      },
      {
        text: 'Нет, оставить как есть',
        value: 'false',
        targetStepId: 'final-rating',
        saveValue: true
      }
    ]
  );
  
  // Шаг 10: Финальная оценка
  yield rating(
    'final-rating',
    'Шаг 10: Оценка проработки',
    'Во сколько баллов оценишь эту проработку?',
    true // финальный шаг
  );
}

// Конфигурация практики
export const goalAlignmentPracticeConfig: PracticeConfig = {
  id: 'goal-alignment',
  title: 'Сонастройка цели с Творцом',
  description: 'Практика сонастройки цели с волей Творца через проверку внутренних ощущений и переформулировку цели.',
  
  hasStartScreen: true,
  startScreenContent: {
    title: 'Сонастройка цели с Творцом',
    description: 'Эта практика поможет вам проверить, насколько ваша цель соответствует духовному пути, и сонастроить ее с высшей волей.',
    duration: '15-30 мин',
    level: 'Средний'
  },
  
  practiceFunction: goalAlignmentPractice,
  
  onFinish: async (context, result) => {
    const practiceRecord = {
      name: 'Сонастройка цели с Творцом',
      route: '/practices/runner/goal-alignment',
      completedAt: new Date().toISOString(),
      result
    };
    
    localStorage.setItem('lastPractice', JSON.stringify(practiceRecord));
    console.log('Goal alignment practice completed with result:', result);
  }
};