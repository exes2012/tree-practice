import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticeLayoutComponent } from '@app/shared/components/practice-layout/practice-layout.component';
import { PracticeService } from '@app/core/services/practice.service';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-netz-hod-line-practice',
  templateUrl: './netz-hod-line-practice.component.html',
  styleUrls: ['./netz-hod-line-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, PracticeLayoutComponent, PageHeaderComponent],
})
export class NetzHodLinePracticeComponent {
  practiceTitle = 'Средняя линия Нецах/Ход';
  practiceSubtitle = 'Работа с верой и смирением';
  description =
    'Эта практика помогает сбалансировать веру (Нецах) и смирение (Ход) в различных аспектах жизни.';
  level = 'Средний';

  showTimer = true;
  mainPracticeStepIndex = 5;

  streamSelected = false;
  selectedStream: string = '';
  steps: any[] = [];

  constructor(private practiceService: PracticeService) {}

  selectStream(stream: string) {
    this.selectedStream = stream;
    this.streamSelected = true;
    this.setSteps();
  }

  setSteps() {
    const commonSteps: { [key: string]: any[] } = {
      creator: [
        {
          title: 'Шаг 1. Построение пространства',
          instruction: 'Почувствуй пространство, себя и свое тело в этом пространстве.',
        },
        {
          title: 'Шаг 2. Сфира Нецах',
          instruction: 'Почувствуй пространство над тобой. Это сфира Нецах.',
        },
        {
          title: 'Шаг 3. Сфира Нецах',
          instruction:
            'Сконцентрируйся на вере в единого Бога (отдача). Выстрой намерение навечно прилепиться к нему. И прикладывай стремление к своему намерению.',
        },
        {
          title: 'Шаг 4. Сфира Ход',
          instruction: 'Почувствуй пространство под тобой. Это сфира Ход',
        },
        {
          title: 'Шаг 5. Сфира Ход',
          instruction:
            'Отталкивай от себя все мысли, говорящие об отсутствии единства. И о том, что есть что-то в этом мире, не являющееся Творцом.',
        },
        {
          title: 'Шаг 6. Нецах/Ход',
          instruction:
            '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Веру в единого Бога и стремление к нему (пространство над тобой).<br><br>2. Отталкивание мыслей об отсутствии единства (пространство под тобой).<br><br>Удерживай себя, свое тело и эти два состояния.',
        },
        {
          title: 'Шаг 7. Оценка упражнения',
          instruction: 'Оцени, насколько хорошо у тебя получилось выполнить упражнение.',
        },
      ],
      self: [
        {
          title: 'Шаг 1. Построение пространства',
          instruction: 'Почувствуй пространство, себя и свое тело в этом пространстве.',
        },
        {
          title: 'Шаг 2. Сфира Нецах',
          instruction: 'Почувствуй пространство над тобой. Это сфира Нецах',
        },
        {
          title: 'Шаг 3. Сфира Нецах',
          instruction:
            'Почувствуй свои внутренние недостатки. Проявляй упорство и внутреннюю выносливость, стремясь к Творцу снизу вверх и прося Творца исправить твои сосуды.',
        },
        {
          title: 'Шаг 4. Сфира Ход',
          instruction: 'Почувствуй пространство под тобой. Это сфира Ход',
        },
        {
          title: 'Шаг 5. Сфира Ход',
          instruction:
            'Сконцентрируйся на принятии своего текущего места в системе мироздания. Согласись с управлением Творца. Что есть, то и хорошо.',
        },
        {
          title: 'Шаг 6. Нецах/Ход',
          instruction:
            '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Упорство в просьбе исправить твои сосуды (пространство над тобой).<br><br>2. Принятие своего места и управления Творца (пространство под тобой).<br><br>Удерживай себя, свое тело и эти два состояния.',
        },
        {
          title: 'Шаг 7. Оценка упражнения',
          instruction: 'Оцени, насколько хорошо у тебя получилось выполнить упражнение.',
        },
      ],
      others: [
        {
          title: 'Шаг 1. Построение пространства',
          instruction: 'Почувствуй пространство, себя и свое тело в этом пространстве.',
        },
        {
          title: 'Шаг 2. Сфира Нецах',
          instruction: 'Почувствуй пространство над тобой. Это сфира Нецах.',
        },
        {
          title: 'Шаг 3. Сфира Нецах',
          instruction:
            'Проси творца дать тебе сосуды, позволяющие вдохновлять других своей настойчивостью и верой на преодоление трудностей.',
        },
        {
          title: 'Шаг 4. Сфира Ход',
          instruction: 'Почувствуй пространство под тобой. Это сфира Ход',
        },
        {
          title: 'Шаг 5. Сфира Ход',
          instruction:
            'Сконцентрируйся на том, чтобы стать для других примером смирения и благодарности. Проси Творца дать тебе такие келим.',
        },
        {
          title: 'Шаг 6. Нецах/Ход',
          instruction:
            '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Просьба о сосудах для вдохновления других (пространство над тобой).<br><br>2. Просьба стать примером смирения и благодарности (пространство под тобой).<br><br>Прикладывай стремление.',
        },
        {
          title: 'Шаг 7. Оценка упражнения',
          instruction: 'Оцени, насколько хорошо у тебя получилось выполнить упражнение.',
        },
      ],
    };
    this.steps = commonSteps[this.selectedStream];
  }

  onPracticeFinished(event: { rating: number }) {
    this.practiceService.saveLastPractice({
      name: this.practiceTitle,
      route: '/practices/small-state/netz-hod-line',
    });
    this.practiceService.recordPracticeCompletion();
  }
}
