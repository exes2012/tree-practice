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

  practiceCards: PracticeCard[] = this.practices.map(p => ({
    title: p.title,
    route: '/practices/intention/exercise',
    icon: 'track_changes',
    colorClass: 'bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800',
    author: 'Бааль Сулам',
    tagColorClass: 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200',
    data: p
  }));

  constructor(private router: Router) {}

  onPracticeSelected(practiceCard: PracticeCard) {
    const navigationExtras: NavigationExtras = {
      state: { practice: practiceCard.data }
    };
    this.router.navigate([practiceCard.route], navigationExtras);
  }
}