import { Component, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tetragrammaton-practice',
  templateUrl: './tetragrammaton-practice.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TetragrammatonPracticeComponent implements OnDestroy {
  isPracticeStarted = false;
  currentStepIndex = 0;
  isVoiceEnabled = false;
  userRating = 5;

  practiceSteps = [
    { 
      title: 'Подготовка', 
      instruction: 'Собственное Имя Бога обычно называется «Тетраграмматон», согласно мудрецам, называвшим его «Четырехбуквенным Именем». На иврите его называют «Имя Авайе».',
      stage: 'Подготовка',
      stageColor: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    },
    { 
      title: 'Значение Имени', 
      instruction: 'Хотя Суть этого Имени выше любого разумения, оно происходит от ивритского корня, означающего «быть» или «приводить другого в состояние бытия». Имя Авайе – это вечное бытие, это Божественная сила, благодаря которой вся реальность находится в состоянии бытия.',
      stage: 'Бытие',
      stageColor: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    },
    { 
      title: 'Четыре буквы', 
      instruction: 'Несмотря на то, что нам запрещено произносить Имя Авайе так, как оно пишется, мы можем медитировать над его четырьмя буквами йуд, хей, вав, хей: י – ה – ו – ה',
      stage: 'Буквы',
      stageColor: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    },
    { 
      title: 'Буква Йуд', 
      instruction: 'Сосредоточимся на первой букве Имени Авайе, букве йуд: י. Она связана с сознанием абсолютного всеприсутствия Бога. Нет никого и ничего, кроме Него, как и нет места свободного от Его присутствия. «Слушай, Израиль Авайе – Бог наш, Авайе Один».',
      stage: 'Йуд',
      stageColor: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
    },
    { 
      title: 'Буква Хей (первая)', 
      instruction: 'Перейдем теперь к медитации над второй буквой Имени Авайе, первой буквой хей: ה. Это сознание Божественного процесса творения. Почувствуйте, как все мироздание, включая и вас самих творится каждый миг из ничего, и это происходит здесь и сейчас.',
      stage: 'Хей 1',
      stageColor: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    },
    { 
      title: 'Буква Вав', 
      instruction: 'Теперь перейдем к медитации над третьей буквой Имени Авайе, буквой вав: ו. Это сознание принадлежности к великому единому целому. Ощутите мироздание как одно гигантское целое. Никакая ее часть не существует сама по себе.',
      stage: 'Вав',
      stageColor: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
    },
    { 
      title: 'Буква Хей (вторая)', 
      instruction: 'Теперь перейдем к медитации над четвертой буквой Имени Авайе, второй буквой хей: ה. Это сознание себя как одного, отдельно существующего индивидуума. Человеку следует полностью осознавать свою ответственность, ибо он располагает свободой выбора.',
      stage: 'Хей 2',
      stageColor: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
    },
    { 
      title: 'Единство уровней', 
      instruction: 'И, наконец, придите к осознанию того, что все эти четыре уровня сознания, по существу, едины.',
      stage: 'Единство',
      stageColor: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200'
    },
    { 
      title: 'Шма Исраэль', 
      instruction: 'Скажите еще раз: Шма Исраэль! Адо-най – Эло-хейну, Адо-най эхад. Слушай, Израиль Авайе – Бог наш, Авайе Один.',
      stage: 'Шма',
      stageColor: 'bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200'
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
