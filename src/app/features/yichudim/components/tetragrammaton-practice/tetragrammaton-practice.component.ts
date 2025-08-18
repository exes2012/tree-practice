import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticeLayoutComponent } from '@app/shared/components/practice-layout/practice-layout.component';
import { PracticeService } from '@app/core/services/practice.service';

@Component({
  selector: 'app-tetragrammaton-practice',
  templateUrl: './tetragrammaton-practice.component.html',
  styleUrls: ['./tetragrammaton-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, PracticeLayoutComponent],
})
export class TetragrammatonPracticeComponent {
  practiceTitle = 'Четырехбуквенное имя';
  practiceSubtitle = 'Медитация на Тетраграмматон';
  description =
    'Медитация над четырьмя буквами священного Имени י-ה-ו-ה, каждая из которых соответствует определенному уровню сознания. Практика ведет через четыре уровня осознания единства.';
  time = '30 мин';
  level = 'Продвинутый';
  showTimer = false;

  practiceSteps = [
    {
      title: 'Подготовка',
      instruction:
        'Собственное Имя Бога обычно называется «Тетраграмматон», согласно мудрецам, называвшим его «Четырехбуквенным Именем». На иврите его называют «Имя Авайе».',
    },
    {
      title: 'Значение Имени',
      instruction:
        'Хотя Суть этого Имени выше любого разумения, оно происходит от ивритского корня, означающего «быть» или «приводить другого в состояние бытия». Имя Авайе – это вечное бытие, это Божественная сила, благодаря которой вся реальность находится в состоянии бытия.',
    },
    {
      title: 'Четыре буквы',
      instruction:
        'Несмотря на то, что нам запрещено произносить Имя Авайе так, как оно пишется, мы можем медитировать над его четырьмя буквами йуд, хей, вав, хей: י – ה – ו – ה',
    },
    {
      title: 'Буква Йуд',
      instruction:
        'Сосредоточимся на первой букве Имени Авайе, букве йуд: י. Она связана с сознанием абсолютного всеприсутствия Бога. Нет никого и ничего, кроме Него, как и нет места свободного от Его присутствия. «Слушай, Израиль Авайе – Бог наш, Авайе Один».',
    },
    {
      title: 'Буква Хей (первая)',
      instruction:
        'Перейдем теперь к медитации над второй буквой Имени Авайе, первой буквой хей: ה. Это сознание Божественного процесса творения. Почувствуйте, как все мироздание, включая и вас самих творится каждый миг из ничего, и это происходит здесь и сейчас.',
    },
    {
      title: 'Буква Вав',
      instruction:
        'Теперь перейдем к медитации над третьей буквой Имени Авайе, буквой вав: ו. Это сознание принадлежности к великому единому целому. Ощутите мироздание как одно гигантское целое. Никакая ее часть не существует сама по себе.',
    },
    {
      title: 'Буква Хей (вторая)',
      instruction:
        'Теперь перейдем к медитации над четвертой буквой Имени Авайе, второй буквой хей: ה. Это сознание себя как одного, отдельно существующего индивидуума. Человеку следует полностью осознавать свою ответственность, ибо он располагает свободой выбора.',
    },
    {
      title: 'Единство уровней',
      instruction:
        'И, наконец, придите к осознанию того, что все эти четыре уровня сознания, по существу, едины.',
    },
    {
      title: 'Шма Исраэль',
      instruction:
        'Скажите еще раз: Шма Исраэль! Адо-най – Эло-хейну, Адо-най эхад. Слушай, Израиль Авайе – Бог наш, Авайе Один.',
    },
    { title: 'Оценка', instruction: 'Как прошла практика?' },
  ];

  constructor(private practiceService: PracticeService) {}

  onPracticeFinished(event: { rating: number }) {
    this.practiceService.saveLastPractice({
      name: this.practiceTitle,
      route: '/yichudim/tetragrammaton',
    });
    this.practiceService.recordPracticeCompletion();
  }
}
