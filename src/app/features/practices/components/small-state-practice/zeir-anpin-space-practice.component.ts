
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticeLayoutComponent } from '@app/shared/components/practice-layout/practice-layout.component';
import { PracticeService } from '@app/core/services/practice.service';

@Component({
  selector: 'app-zeir-anpin-space-practice',
  templateUrl: './zeir-anpin-space-practice.component.html',
  styleUrls: ['./zeir-anpin-space-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, PracticeLayoutComponent]
})
export class ZeirAnpinSpacePracticeComponent {
  practiceTitle = 'Пространство Зеир Анпина';
  practiceSubtitle = 'Построение малого лика';
  description = 'Это упражнение помогает построить "малый лик" (Зеир Анпин) через соотнесение шести направлений с соответствующими сфирот и их принципами.';
  level = 'Средний';

  showTimer = true;
  mainPracticeStepIndex = 9;

  practiceSteps = [
    { title: 'Шаг 1: Пространство', instruction: 'Почувствуй пространство, себя и свое тело.' },
    { title: 'Шаг 2: Сфира Нецах', instruction: 'Отметь пространство сверху. Это сфира Нэцах. Вера в существование Бога. Удерживай это состояние' },
    { title: 'Шаг 3: Сфира Ход', instruction: 'Отметь пространство снизу. Это сфира Ход. Отказ от идолопоклонства. Удерживай это состояние' },
    { title: 'Шаг 4: Сфира Есод', instruction: 'Отметь пространство позади себя. Это сфира Есод. Охрана разума от нечистых мыслей. Удерживай это состояние' },
    { title: 'Шаг 5: Сфира Хесед', instruction: 'Отметь пространство справа от себя. Это сфира Хесэд. Любовь к Богу. Удерживай это состояние' },
    { title: 'Шаг 6: Сфира Гвура', instruction: 'Отметь пространство слева от себя. Это сфира Гвура. Трепет перед Творцом. Удерживай это состояние' },
    { title: 'Шаг 7: Сфира Тиферет', instruction: 'Отметь пространство перед тобой. Это сфира Тифэрэт. Вера в единство Бога. Удерживай это состояние' },
    { title: 'Шаг 8: Куб', instruction: 'Отметь все пространства одновременно, и себя как Малхут внутри них, формируя куб. Удерживай это состояние' },
    { title: 'Шаг 9: Найти Творца', instruction: 'Найди в этом пространстве Творца' },
    { title: 'Шаг 10: Единение', instruction: 'Оставайся с Творцом в пространстве Зэир Анпина. Сокращай все мысли, отрывающие тебя от единства с Ним.' },
    { title: 'Шаг 11: Оценка', instruction: 'Оцени, насколько хорошо у тебя получилось выполнить упражнение.' }
  ];

  constructor(private practiceService: PracticeService) {}

  onPracticeFinished(event: { rating: number }) {
    this.practiceService.saveLastPractice({ name: this.practiceTitle, route: '/practices/small-state/zeir-anpin-space' });
    this.practiceService.recordPracticeCompletion();
  }
}
