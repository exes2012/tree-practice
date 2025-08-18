import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { PracticeRunnerComponent } from '../../../../shared/components/practice-runner/practice-runner.component';
import { PracticeConfig, PracticeResult } from '../../../../core/models/practice-engine.types';
import { specificRequestPracticeV2Config } from '../../../../core/practices/specific-request-practice-v2';
import { shekhinahFieldPracticeConfig } from '../../../../core/practices/shekhinah-field-practice';
import { specificRequestPracticeCopyConfig } from '../../../../core/practices/specific-request-practice-copy';
import { healthWorkPracticeConfig } from '../../../../core/practices/health-work-practice';
import { habitsWorkPracticeConfig } from '../../../../core/practices/habits-work-practice';
import { shadowIntegrationPracticeConfig } from '../../../../core/practices/shadow-integration-practice';
import { goalAlignmentPracticeConfig } from '../../../../core/practices/goal-alignment-practice';
import { goalIdentificationPracticeConfig } from '../../../../core/practices/goal-identification-practice';
import { goalManPracticeConfig } from '../../../../core/practices/goal-man-practice';
import { reflectedLightPracticeConfig } from '../../../../core/practices/reflected-light-practice';
import { fourStagesPracticeConfig } from '../../../../core/practices/four-stages-practice';
import { keterTuningPracticeConfig } from '../../../../core/practices/keter-tuning-practice';
import { gratitudeYichudPracticeConfig } from '../../../../core/practices/gratitude-yichud-practice';
import { divineSpaceYichudPracticeConfig } from '../../../../core/practices/divine-space-yichud-practice';
import { breathingJoyYichudPracticeConfig } from '../../../../core/practices/breathing-joy-yichud-practice';
import { shabbatYichudPracticeConfig } from '../../../../core/practices/shabbat-yichud-practice';
import { tetragrammatonYichudPracticeConfig } from '../../../../core/practices/tetragrammaton-yichud-practice';
import { loveYichudPracticeConfig } from '../../../../core/practices/love-yichud-practice';
import { candleFlameYichudPracticeConfig } from '../../../../core/practices/candle-flame-yichud-practice';
import { seventyTwoNamesYichudPracticeConfig } from '../../../../core/practices/seventy-two-names-yichud-practice';
import { intentionPracticeConfig } from '../../../../core/practices/intention-practice';
import {
  eternalContactPracticeConfig,
  cancelFearPracticeConfig,
  transformLovePracticeConfig,
  perfectionPracticeConfig,
  torahStudyPracticeConfig,
  shepherdDogPracticeConfig,
  beforeCreatorPracticeConfig,
  avayaLettersPracticeConfig,
  righteousGreatnessaPracticeConfig,
  emptinessFeelPracticeConfig,
  noneButHimPracticeConfig,
  tableBeforeGodPracticeConfig,
  thoughtControlPracticeConfig
} from '../../../../core/practices/intention-exercises';
import { creatorSpacePracticeConfig, zeirAnpinSpacePracticeConfig, netzHodLinePracticeConfig, hesedGevurahLinePracticeConfig } from '../../../../core/practices/small-state-practices';
import { GoalService } from '../../../../core/services/goal.service';
import { PracticeService } from '../../../../core/services/practice.service';

@Component({
  selector: 'app-practice-runner-demo',
  template: `
    <app-practice-runner 
      *ngIf="practiceConfig"
      [config]="practiceConfig"
      [initialContext]="initialContext"
      (practiceFinished)="onPracticeFinished($event)"
      (practiceStarted)="onPracticeStarted()">
    </app-practice-runner>
    
    <div *ngIf="!practiceConfig" class="container mx-auto px-4 pt-8 text-center">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p class="text-gray-700 dark:text-gray-300">Практика не найдена</p>
        <button (click)="goHome()" class="mt-4 px-4 py-2 bg-primary-500 text-white rounded">
          На главную
        </button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, PracticeRunnerComponent]
})
export class PracticeRunnerDemoComponent implements OnInit {
  practiceConfig: PracticeConfig | null = null;
  initialContext: any = {};
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private goalService: GoalService,
    private practiceService: PracticeService
  ) {}
  
  ngOnInit(): void {
    this.setupPractice();
  }
  
  private setupPractice(): void {
    const practiceId = this.route.snapshot.params['practiceId'];
    const goalId = this.route.snapshot.params['goalId'];
    
    // Загружаем цель, если нужна
    if (goalId) {
      const goal = this.goalService.getGoalById(goalId);
      this.initialContext = { goalId, goal };
    }
    
    // Убрали старую логику query params - теперь каждое упражнение имеет свою практику
    
    // Выбираем конфигурацию практики
    switch (practiceId) {
      case 'specific-request':
      case 'specific-request-v2': // Поддерживаем старый ID для совместимости
        this.practiceConfig = specificRequestPracticeV2Config;
        break;

      case 'shekhinah-field':
        this.practiceConfig = shekhinahFieldPracticeConfig;
        break;

      case 'specific-request-copy':
        this.practiceConfig = specificRequestPracticeCopyConfig;
        break;

      case 'health-work':
        this.practiceConfig = healthWorkPracticeConfig;
        break;

      case 'habits-work':
        this.practiceConfig = habitsWorkPracticeConfig;
        break;

      case 'shadow-integration':
        this.practiceConfig = shadowIntegrationPracticeConfig;
        break;

      case 'goal-alignment':
        this.practiceConfig = goalAlignmentPracticeConfig;
        break;

      case 'goal-identification':
        this.practiceConfig = goalIdentificationPracticeConfig;
        break;

      case 'goal-man':
        this.practiceConfig = goalManPracticeConfig;
        break;

      case 'reflected-light':
        this.practiceConfig = reflectedLightPracticeConfig;
        break;

      case 'four-stages':
        this.practiceConfig = fourStagesPracticeConfig;
        break;

      case 'keter-tuning':
        this.practiceConfig = keterTuningPracticeConfig;
        break;

      case 'gratitude-yichud':
        this.practiceConfig = gratitudeYichudPracticeConfig;
        break;

      case 'divine-space-yichud':
        this.practiceConfig = divineSpaceYichudPracticeConfig;
        break;

      case 'breathing-joy-yichud':
        this.practiceConfig = breathingJoyYichudPracticeConfig;
        break;

      case 'shabbat-yichud':
        this.practiceConfig = shabbatYichudPracticeConfig;
        break;

      case 'tetragrammaton-yichud':
        this.practiceConfig = tetragrammatonYichudPracticeConfig;
        break;

      case 'love-yichud':
        this.practiceConfig = loveYichudPracticeConfig;
        break;

      case 'candle-flame-yichud':
        this.practiceConfig = candleFlameYichudPracticeConfig;
        break;

      case 'seventy-two-names-yichud':
        this.practiceConfig = seventyTwoNamesYichudPracticeConfig;
        break;

      case 'intention-practice':
        this.practiceConfig = intentionPracticeConfig;
        break;

      // Отдельные упражнения намерения
      case 'eternal-contact':
        this.practiceConfig = eternalContactPracticeConfig;
        break;
      
      case 'cancel-fear':
        this.practiceConfig = cancelFearPracticeConfig;
        break;
      
      case 'transform-love':
        this.practiceConfig = transformLovePracticeConfig;
        break;
      
      case 'perfection':
        this.practiceConfig = perfectionPracticeConfig;
        break;
      
      case 'torah-study':
        this.practiceConfig = torahStudyPracticeConfig;
        break;
      
      case 'shepherd-dog':
        this.practiceConfig = shepherdDogPracticeConfig;
        break;
      
      case 'before-creator':
        this.practiceConfig = beforeCreatorPracticeConfig;
        break;
      
      case 'avaya-letters':
        this.practiceConfig = avayaLettersPracticeConfig;
        break;
      
      case 'righteous-greatness':
        this.practiceConfig = righteousGreatnessaPracticeConfig;
        break;
      
      case 'emptiness-feel':
        this.practiceConfig = emptinessFeelPracticeConfig;
        break;
      
      case 'none-but-him':
        this.practiceConfig = noneButHimPracticeConfig;
        break;
      
      case 'table-before-god':
        this.practiceConfig = tableBeforeGodPracticeConfig;
        break;
      
      case 'thought-control':
        this.practiceConfig = thoughtControlPracticeConfig;
        break;

      // Small State Practices
      case 'small-state-creator-space':
        this.practiceConfig = creatorSpacePracticeConfig;
        break;

      case 'small-state-zeir-anpin-space':
        this.practiceConfig = zeirAnpinSpacePracticeConfig;
        break;

      case 'small-state-netz-hod-line':
        this.practiceConfig = netzHodLinePracticeConfig;
        break;

      case 'small-state-hesed-gevurah-line':
        this.practiceConfig = hesedGevurahLinePracticeConfig;
        break;

      default:
        console.error('Unknown practice:', practiceId);
        break;
    }
  }
  
  onPracticeStarted(): void {
    console.log('Practice started');
  }
  
  onPracticeFinished(result: PracticeResult): void {
    console.log('Practice finished with result:', result);
    
    const practiceId = this.route.snapshot.params['practiceId'];
    
    // Записываем практику в счетчик и дневник
    const practiceTitles: { [key: string]: string } = {
      'specific-request': 'Специфический запрос',
      'specific-request-v2': 'Специфический запрос V2',
      'shekhinah-field': 'Поле Шхины',
      'specific-request-copy': 'Специфический запрос (копия)',
      'health-work': 'Работа со здоровьем',
      'habits-work': 'Работа с привычками',
      'shadow-integration': 'Интеграция тени',
      'goal-alignment': 'Выравнивание целей',
      'goal-identification': 'Выявление цели',
      'goal-man': 'Человеческий уровень цели',
      'reflected-light': 'Отраженный свет',
      'four-stages': 'Четыре стадии',
      'keter-tuning': 'Настройка на свет',
      'gratitude-yichud': 'Благодарность',
      'divine-space-yichud': 'Божественное пространство',
      'breathing-joy-yichud': 'Радость дыхания',
      'shabbat-yichud': 'Шаббат',
      'tetragrammaton-yichud': 'Четырехбуквенное имя',
      'love-yichud': 'Любовь',
      'candle-flame-yichud': 'Пламя свечи',
      'intention-practice': 'Практика намерения',
      'eternal-contact': 'Вечный контакт',
      'cancel-fear': 'Отменить страх',
      'transform-love': 'Преобразовать любовь',
      'perfection': 'Совершенство',
      'torah-study': 'Изучение Торы',
      'shepherd-dog': 'Пастушья собака',
      'before-creator': 'Перед Творцом',
      'avaya-letters': 'Буквы Авайе',
      'righteous-greatness': 'Праведное величие',
      'emptiness-feel': 'Ощущение пустоты',
      'none-but-him': 'Нет никого кроме Него',
      'table-before-god': 'Стол перед Богом',
      'thought-control': 'Контроль мысли',
      'small-state-creator-space': 'Пространство с Творцом',
      'small-state-zeir-anpin-space': 'Пространство Зеир Анпина',
      'small-state-netz-hod-line': 'Средняя линия Нецах/Ход',
      'small-state-hesed-gevurah-line': 'Средняя линия Хесед/Гвура'
    };
    
    const practiceTitle = practiceTitles[practiceId] || practiceId;
    this.practiceService.saveLastPractice({ 
      name: practiceTitle, 
      route: `/practices/runner/${practiceId}` 
    });
    this.practiceService.recordPracticeCompletion();
    
    // Особая логика для упражнений намерения (включая все отдельные упражнения)
    const intentionPractices = [
      'intention-practice', 'eternal-contact', 'cancel-fear', 'transform-love', 
      'perfection', 'torah-study', 'shepherd-dog', 'before-creator', 
      'avaya-letters', 'righteous-greatness', 'emptiness-feel', 
      'none-but-him', 'table-before-god', 'thought-control'
    ];
    
    if (intentionPractices.includes(practiceId)) {
      const action = result.finalResult?.action;
      console.log('Navigation: received action from intention practice:', action, 'practiceId:', practiceId);
      
      if (action === 'set_as_challenge') {
        // Если установили как намерение дня, идем на главную
        console.log('Navigating to home after setting daily challenge');
        this.router.navigate(['/home']);
        return;
      } else if (action === 'go_home') {
        // Если нажали "На главную", идем на главную
        console.log('Navigating to home');
        this.router.navigate(['/home']);
        return;
      } else {
        // Fallback - всегда идем на главную для упражнений намерения
        console.log('Fallback navigation to home for intention practice');
        this.router.navigate(['/home']);
        return;
      }
    }
    
    // Обычная навигация после завершения для других практик
    const goalId = this.route.snapshot.params['goalId'];
    if (goalId) {
      this.router.navigate(['/goals', goalId]);
    } else {
      this.router.navigate(['/practices']);
    }
  }
  
  goHome(): void {
    this.router.navigate(['/']);
  }
}