import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticeLayoutComponent } from '@app/shared/components/practice-layout/practice-layout.component';
import { PracticeService } from '@app/core/services/practice.service';

@Component({
  selector: 'app-gratitude-practice',
  templateUrl: './gratitude-practice.component.html',
  
  standalone: true,
  imports: [CommonModule, PracticeLayoutComponent],
})
export class GratitudePracticeComponent {
  practiceTitle = 'Благодарность';
  practiceSubtitle = 'Произнести утреннюю благодарность';
  description =
    'Утренняя молитва благодарности за возвращение души. Мы изучим смысл слов "Модэ ани" и их глубокое духовное значение. Эта практика помогает начать день с правильного настроя благодарности и смирения перед Творцом.';
  time = '18 мин';
  level = 'Начальный';
  showTimer = false;

  practiceSteps = [
    {
      title: 'Подготовка',
      instruction:
        'Проснувшись утром, мы благодарим Бога за то, что Он вернул нам душу. Первые слова, которые мы произносим, пробудившись.',
      stage: 'Подготовка',
      stageColor: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    },
    {
      title: 'Модэ ани на русском',
      instruction:
        'Благодарю Тебя, Владыка живой и вечный, за то, что Ты, по милости Своей, вернул мне душу мою. Как велика Твоя вера в меня.',
      stage: 'Русский',
      stageColor: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    },
    {
      title: 'Модэ ани на иврите',
      instruction:
        'На иврите это звучит так: Модэ ани лефанеха мелех хай ве-кайям, ше-хехезарта би нишмати бехемла. Раба эмунатеха.',
      stage: 'Иврит',
      stageColor: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    },
    {
      title: 'Пустой сосуд',
      instruction:
        'Чтобы выразить нашу искреннюю благодарность, мы должны ощущать себя пустым сосудом. Если бы не доброта и сострадание Дающего нам жизнь, мы остались бы пустыми, лишенными всего.',
      stage: 'Смирение',
      stageColor: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
    },
    {
      title: 'Присутствие Царя',
      instruction:
        'Исполненные истинного смирения, мы ощущаем присутствие Вечного Царя, пребывающего над нами. Каждую ночь перед отходом ко сну мы возвращаем Богу наши обессиленные, «изношенные» души.',
      stage: 'Присутствие',
      stageColor: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    },
    {
      title: 'Обновление души',
      instruction:
        'Каждое утро мы получаем наши души обновленными, полными свежих сил. Как велика вера Бога в нас! Учат мудрецы, что сон – «одна шестидесятая» часть смерти.',
      stage: 'Обновление',
      stageColor: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200',
    },
    {
      title: 'Воскрешение',
      instruction:
        'Получая «почти умершую» душу, Бог возвращает нам ее возрожденной. Так же как Он верен нам в этом мире, так же Он будет верен нам и в Мире Грядущем, и мы полагаемся на Него в том, что он воскресит нас после смерти.',
      stage: 'Воскрешение',
      stageColor: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    },
    {
      title: 'Весь день',
      instruction:
        'Наш день начинается с этой мысли о благодарности Б-гу. Мысль эта, «выгравированная» в нашем сознании, сопровождает нас целый день.',
      stage: 'Постоянство',
      stageColor: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
    },
    { title: 'Оценка', instruction: 'Как прошла практика?' },
  ];

  constructor(private practiceService: PracticeService) {}

  onPracticeFinished(event: { rating: number }) {
    this.practiceService.saveLastPractice({
      name: this.practiceTitle,
      route: '/yichudim/gratitude',
    });
    this.practiceService.recordPracticeCompletion();
  }
}
