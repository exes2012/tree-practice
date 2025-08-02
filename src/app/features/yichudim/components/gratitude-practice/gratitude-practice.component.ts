import { Component, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gratitude-practice',
  templateUrl: './gratitude-practice.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GratitudePracticeComponent implements OnDestroy {
  isPracticeStarted = false;
  currentStepIndex = 0;
  isVoiceEnabled = false;
  userRating = 5;

  practiceSteps = [
    { 
      title: 'Подготовка', 
      instruction: 'Проснувшись утром, мы благодарим Бога за то, что Он вернул нам душу. Первые слова, которые мы произносим, пробудившись.',
      stage: 'Подготовка',
      stageColor: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    },
    { 
      title: 'Модэ ани на русском', 
      instruction: 'Благодарю Тебя, Владыка живой и вечный, за то, что Ты, по милости Своей, вернул мне душу мою. Как велика Твоя вера в меня.',
      stage: 'Русский',
      stageColor: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    },
    { 
      title: 'Модэ ани на иврите', 
      instruction: 'На иврите это звучит так: Модэ ани лефанеха мелех хай ве-кайям, ше-хехезарта би нишмати бехемла. Раба эмунатеха.',
      stage: 'Иврит',
      stageColor: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    },
    { 
      title: 'Пустой сосуд', 
      instruction: 'Чтобы выразить нашу искреннюю благодарность, мы должны ощущать себя пустым сосудом. Если бы не доброта и сострадание Дающего нам жизнь, мы остались бы пустыми, лишенными всего.',
      stage: 'Смирение',
      stageColor: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
    },
    { 
      title: 'Присутствие Царя', 
      instruction: 'Исполненные истинного смирения, мы ощущаем присутствие Вечного Царя, пребывающего над нами. Каждую ночь перед отходом ко сну мы возвращаем Богу наши обессиленные, «изношенные» души.',
      stage: 'Присутствие',
      stageColor: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    },
    { 
      title: 'Обновление души', 
      instruction: 'Каждое утро мы получаем наши души обновленными, полными свежих сил. Как велика вера Бога в нас! Учат мудрецы, что сон – «одна шестидесятая» часть смерти.',
      stage: 'Обновление',
      stageColor: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
    },
    { 
      title: 'Воскрешение', 
      instruction: 'Получая «почти умершую» душу, Бог возвращает нам ее возрожденной. Так же как Он верен нам в этом мире, так же Он будет верен нам и в Мире Грядущем, и мы полагаемся на Него в том, что он воскресит нас после смерти.',
      stage: 'Воскрешение',
      stageColor: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
    },
    { 
      title: 'Весь день', 
      instruction: 'Наш день начинается с этой мысли о благодарности Б-гу. Мысль эта, «выгравированная» в нашем сознании, сопровождает нас целый день.',
      stage: 'Постоянство',
      stageColor: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200'
    }
  ];

  constructor(private location: Location) {}

  ngOnDestroy() {
    window.speechSynthesis.cancel();
  }

  goBack() {
    window.speechSynthesis.cancel();
    this.location.back();
  }

  toggleVoice() {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    if (!this.isVoiceEnabled) {
      window.speechSynthesis.cancel();
    }
  }

  speak(text: string) {
    if (this.isVoiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }

  startPractice() {
    this.isPracticeStarted = true;
    this.currentStepIndex = 0;
    this.speak(this.practiceSteps[0].instruction);
  }

  nextStep() {
    if (this.currentStepIndex < this.practiceSteps.length - 1) {
      this.currentStepIndex++;
      this.speak(this.practiceSteps[this.currentStepIndex].instruction);
    }
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.speak(this.practiceSteps[this.currentStepIndex].instruction);
    }
  }

  finishPractice() {
    this.currentStepIndex = this.practiceSteps.length; // Move to rating step
    window.speechSynthesis.cancel();
  }

  exitPractice() {
    this.location.back();
  }

  getRatingFace(): string {
    if (this.userRating == 10) return '🤩';
    if (this.userRating >= 9) return '😁';
    if (this.userRating >= 8) return '😄';
    if (this.userRating >= 7) return '😊';
    if (this.userRating >= 6) return '🙂';
    if (this.userRating >= 5) return '😐';
    if (this.userRating >= 4) return '😕';
    if (this.userRating >= 3) return '😟';
    if (this.userRating >= 2) return '😢';
    return '😭';
  }
}
