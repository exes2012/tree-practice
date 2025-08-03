
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticeLayoutComponent } from '@app/shared/components/practice-layout/practice-layout.component';
import { PracticeService } from '@app/core/services/practice.service';

@Component({
  selector: 'app-creator-space-practice',
  templateUrl: './creator-space-practice.component.html',
  styleUrls: ['./creator-space-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, PracticeLayoutComponent]
})
export class CreatorSpacePracticeComponent {
  // --- Practice Content ---
  practiceTitle = 'Пространство с Творцом';
  practiceSubtitle = 'Ощущение единства';
  description = 'Это упражнение направлено на формирование ощущения пространства и единства с Творцом через удержание внимания на шести направлениях.';
  level = 'Средний';

  // --- Timer Configuration ---
  showTimer = true;
  mainPracticeStepIndex = 9; // The step where the main practice begins

  // --- Steps --- 
  practiceSteps = [
    { title: 'Шаг 1: Пространство', instruction: 'Почувствуй пространство, себя и свое тело.' },
    { title: 'Шаг 2: Перед тобой', instruction: 'Отметь пространство перед тобой и себя.' },
    { title: 'Шаг 3: Позади тебя', instruction: 'Отметь пространство позади себя и себя.' },
    { title: 'Шаг 4: Слева', instruction: 'Отметь пространство слева от себя и себя.' },
    { title: 'Шаг 5: Справа', instruction: 'Отметь пространство справа от себя и себя.' },
    { title: 'Шаг 6: Сверху', instruction: 'Отметь пространство сверху от себя и себя.' },
    { title: 'Шаг 7: Снизу', instruction: 'Отметь пространство снизу от себя и себя.' },
    { title: 'Шаг 8: Куб', instruction: 'Отметь все пространства одновременно, и себя внутри, формируя куб.' },
    { title: 'Шаг 9: Вопрос к Творцу', instruction: 'Удерживая пространство вниманием найди в этом пространстве Творца"' },
    { title: 'Шаг 10: Единение', instruction: 'Удерживая пространство вниманием страстно желай прилепиться к Творцу и остаться в состоянии прилепления навечно. Сокращай все мысли, отрывающие тебя от единства с Ним.' },
    { title: 'Шаг 11: Оценка', instruction: 'Оцени, насколько хорошо у тебя получилось выполнить упражнение.' }
  ];

  constructor(private practiceService: PracticeService) {}

  onPracticeFinished(event: { rating: number }) {
    console.log('Practice finished with rating:', event.rating);
    this.practiceService.saveLastPractice({ name: this.practiceTitle, route: '/practices/small-state/creator-space' });
    this.practiceService.recordPracticeCompletion();
  }

  getInstruction(step: any, selectedStepDuration: number, selectedPracticeDuration: number): string {
    let instruction = step.instruction;
    if (step.index >= 1 && step.index <= 7) {
      instruction += ` Удерживай это состояние на протяжении ${selectedStepDuration} секунд.`;
    }
    if (step.index === 9) {
      const minuteWord = this.getMinuteWord(selectedPracticeDuration);
      instruction += ` на протяжении ${selectedPracticeDuration} ${minuteWord}.`;
    }
    return instruction;
  }

  private getMinuteWord(minutes: number): string {
    const lastDigit = minutes % 10;
    const lastTwoDigits = minutes % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'минут';
    if (lastDigit === 1) return 'минуты';
    if (lastDigit >= 2 && lastDigit <= 4) return 'минут';
    return 'минут';
  }
}
