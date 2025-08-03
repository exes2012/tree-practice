
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticeLayoutComponent } from '@app/shared/components/practice-layout/practice-layout.component';
import { PracticeService } from '@app/core/services/practice.service';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-hesed-gevurah-line-practice',
  templateUrl: './hesed-gevurah-line-practice.component.html',
  styleUrls: ['./hesed-gevurah-line-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, PracticeLayoutComponent, PageHeaderComponent]
})
export class HesedGevurahLinePracticeComponent {
  practiceTitle = 'Средняя линия Хесед/Гвура';
  practiceSubtitle = 'Работа с любовью и строгостью';
  description = 'Эта практика помогает сбалансировать любовь (Хесед) и строгость (Гвура) в различных аспектах жизни.';
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
        { title: 'Шаг 1. Построение пространства', instruction: 'Почувствуй пространство, себя и свое тело в этом пространстве.' },
        { title: 'Шаг 2. Сфира Хесед', instruction: 'Почувствуй пространство справа от тебя.' },
        { title: 'Шаг 3. Сфира Хесед', instruction: 'Сконцентрируйся на состоянии безграничной любви к Творцу и стремлении к слиянию с Ним по свойствам.' },
        { title: 'Шаг 4. Сфира Гвура', instruction: 'Почувствуй пространство слева.' },
        { title: 'Шаг 5. Сфира Гвура', instruction: 'Сконцентрируйся на Трепете перед Творцом. И страхе потерять с Ним связь.' },
        { title: 'Шаг 6. Хесед/Гвура', instruction: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Безграничную любовь к Творцу (пространство справа).<br><br>2. Трепет перед Ним и страх потерять связь (пространство слева).<br><br>Удерживай себя, свое тело и эти два состояния.' },
        { title: 'Шаг 7. Оценка упражнения', instruction: 'Оцени, насколько хорошо у тебя получилось выполнить упражнение.' },
      ],
      self: [
        { title: 'Шаг 1. Построение пространства', instruction: 'Почувствуй пространство, себя и свое тело в этом пространстве.' },
        { title: 'Шаг 2. Сфира Хесед', instruction: 'Почувствуй пространство справа от тебя.' },
        { title: 'Шаг 3. Сфира Хесед', instruction: 'Сконцентрируйся на проявлении безусловного милосердия и принятия в отношении себя и своих недостатков.' },
        { title: 'Шаг 4. Сфира Гвура', instruction: 'Почувствуй пространство слева.' },
        { title: 'Шаг 5. Сфира Гвура', instruction: 'Сконцентрируйся на сознательном ограничении и преодолении своих эгоистических устремлений.' },
        { title: 'Шаг 6. Хесед/Гвура', instruction: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Безусловное милосердие к себе (пространство справа).<br><br>2. Сознательное ограничение эгоизма (пространство слева).<br><br>Удерживай себя, свое тело и эти два состояния.' },
        { title: 'Шаг 7. Оценка упражнения', instruction: 'Оцени, насколько хорошо у тебя получилось выполнить упражнение.' },
      ],
      others: [
        { title: 'Шаг 1. Построение пространства', instruction: 'Почувствуй пространство, себя и свое тело в этом пространстве.' },
        { title: 'Шаг 2. Сфира Хесед', instruction: 'Почувствуй пространство справа от тебя.' },
        { title: 'Шаг 3. Сфира Хесед', instruction: 'Сконцентрируйся на проявлении безусловного милосердия в отношении окружающих.' },
        { title: 'Шаг 4. Сфира Гвура', instruction: 'Почувствуй пространство слева.' },
        { title: 'Шаг 5. Сфира Гвура', instruction: 'Сконцентрируйся на проявлении справедливости и установке необходимых границ для истинного блага других.' },
        { title: 'Шаг 6. Хесед/Гвура', instruction: '<strong>Удерживай одновременно два состояния:</strong><br><br>1. Безусловное милосердие к другим (пространство справа).<br><br>2. Справедливость и установка границ (пространство слева).<br><br>Удерживай себя, свое тело и эти два состояния.' },
        { title: 'Шаг 7. Оценка упражнения', instruction: 'Оцени, насколько хорошо у тебя получилось выполнить упражнение.' },
      ]
    };
    this.steps = commonSteps[this.selectedStream];
  }

  onPracticeFinished(event: { rating: number }) {
    this.practiceService.saveLastPractice({ name: this.practiceTitle, route: '/practices/small-state/hesed-gevurah-line' });
    this.practiceService.recordPracticeCompletion();
  }
}
