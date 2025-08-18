import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PracticeListComponent, PracticeCard } from '@app/shared/components/practice-list/practice-list.component';
import { SharedModule } from '@app/shared/shared.module';
import { PracticePageLayoutComponent } from '@app/shared/components/practice-page-layout/practice-page-layout.component';

interface IntentionPractice {
  title: string;
  description: string;
}

@Component({
  selector: 'app-intention-practice',
  templateUrl: './intention-practice.component.html',
  styleUrls: ['./intention-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, PracticeListComponent, SharedModule, PracticePageLayoutComponent]
})
export class IntentionPracticeComponent {
  practices: IntentionPractice[] = [
    { title: 'Вечный контакт', description: 'В течении дня во время любой работы или размышления представляй, будто это твоё последнее и вечное состояние. Вызови в себе сильнейшую страсть навечно остаться в этом контакте с Творцом.' },
    { title: 'Отмена страха', description: 'В течении дня любой возникающий физический страх, тревогу, беспокойство переноси на страх перед Небом. Страх оторваться от Творца. Почувствуй его отчётливо внутри себя.' },
    { title: 'Преобразование любви', description: 'В течении дня любую любовь к материальному переноси на любовь к Всевышнему. Представляй ярко и детально.' },
    { title: 'Совершенство', description: 'В течении дня останавливайся и представляй себя совершенно совершенным и уверенным в связи с Творцом.' },
    { title: 'Настрой в изучении Торы', description: 'В течении дня представляй, что Всевышний страстно желает раскрыть тебе тайны Торы. Почувствуй сильное желание постичь тайны Торы, визуализируя, как ты соединяешься с Творцом через них.' },
    { title: 'Собака пастуха', description: 'В течении дня заметив тягу к физическим удовольствиям, осознай её как «собаку». Переориентируй эту страсть на получение духовного Света. Визуализируй духовное наслаждение, чтобы удержать себя от соблазнов материального.' },
    { title: 'Быть перед Творцом', description: 'В течении дня приучись представлять, что стоишь перед Творцом. Представляй, что каждое твоё действие является поручением от Творца.' },
    { title: 'Буквы имени АВАЯ', description: 'В течении дня визуализируй ярко, как буквы Его имени АВАЯ пылают перед тобой.\nДелай это при отвлечении на материальные мысли, чтобы удержать себя в святости.' },
    { title: 'Величие праведников', description: 'В течении дня сознательно визуализируй величие праведников, передавших тебе Тору.\nПочувствуй, как это увеличивает твой сосуд желания постичь тайны Торы.' },
    { title: 'Ощущение опустошения', description: 'В течении дня в моменты опустошения не беги от него, а сразу страстно пожелай наполнить пустоту Светом Творца.\nУкрепляйся стремлением вне себя при первых признаках «вечера» (спада).' },
    { title: 'Нет никого кроме Него', description: 'В течении дня представляй, что все, что тебя окружает - это Творец. Добейся ощущения единства всего. Отталкивай от себя мысли, говорящие об отсутствии единства.' },
    { title: 'Стол перед Всевышним', description: 'В течении дня На каждой трапезе представь, что сидишь за столом перед Царём.\nЕшь, сохраняя трепет и благодарность за пищу как за подарок от Него.' },
    { title: 'Управление мыслью', description: 'В течени дня научи себя удерживать чистую мысль о Всевышнем (начни с часа в день). Наказывай себя за отвлечения, приучи тело бояться ненужных мыслей.' }
  ];

  practiceCards: PracticeCard[] = [
    { title: 'Вечный контакт', route: '/practices/runner/eternal-contact', icon: 'track_changes', colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800', author: 'Бааль Сулам', tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' },
    { title: 'Отмена страха', route: '/practices/runner/cancel-fear', icon: 'track_changes', colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800', author: 'Бааль Сулам', tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' },
    { title: 'Преобразование любви', route: '/practices/runner/transform-love', icon: 'track_changes', colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800', author: 'Бааль Сулам', tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' },
    { title: 'Совершенство', route: '/practices/runner/perfection', icon: 'track_changes', colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800', author: 'Бааль Сулам', tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' },
    { title: 'Настрой в изучении Торы', route: '/practices/runner/torah-study', icon: 'track_changes', colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800', author: 'Бааль Сулам', tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' },
    { title: 'Собака пастуха', route: '/practices/runner/shepherd-dog', icon: 'track_changes', colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800', author: 'Бааль Сулам', tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' },
    { title: 'Быть перед Творцом', route: '/practices/runner/before-creator', icon: 'track_changes', colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800', author: 'Бааль Сулам', tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' },
    { title: 'Буквы имени АВАЯ', route: '/practices/runner/avaya-letters', icon: 'track_changes', colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800', author: 'Бааль Сулам', tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' },
    { title: 'Величие праведников', route: '/practices/runner/righteous-greatness', icon: 'track_changes', colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800', author: 'Бааль Сулам', tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' },
    { title: 'Ощущение опустошения', route: '/practices/runner/emptiness-feel', icon: 'track_changes', colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800', author: 'Бааль Сулам', tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' },
    { title: 'Нет никого кроме Него', route: '/practices/runner/none-but-him', icon: 'track_changes', colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800', author: 'Бааль Сулам', tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' },
    { title: 'Стол перед Всевышним', route: '/practices/runner/table-before-god', icon: 'track_changes', colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800', author: 'Бааль Сулам', tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' },
    { title: 'Управление мыслью', route: '/practices/runner/thought-control', icon: 'track_changes', colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800', author: 'Бааль Сулам', tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' }
  ];

  constructor(private router: Router) {}

  onPracticeSelected(practiceCard: PracticeCard) {
    // Теперь просто переходим по route - каждое упражнение имеет свою отдельную практику
    this.router.navigate([practiceCard.route]);
  }
}