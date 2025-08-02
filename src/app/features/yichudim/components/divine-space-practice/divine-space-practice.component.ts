import { Component, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-divine-space-practice',
  templateUrl: './divine-space-practice.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DivineSpacePracticeComponent implements OnDestroy {
  isPracticeStarted = false;
  currentStepIndex = 0;
  isVoiceEnabled = false;
  userRating = 5;

  practiceSteps = [
    { 
      title: 'Подготовка', 
      instruction: 'Давайте мысленно построим вокруг нас с помощью медитации Божественное пространство, духовное святилище. В пространстве есть шесть направлений.',
      stage: 'Подготовка',
      stageColor: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    },
    { 
      title: 'Пространство сверху', 
      instruction: 'Осознайте Божественное пространство, находящееся над вами. Это сознание первого из Десяти Речений: «Я – Авайе, Бог твой». Это сознание Всемогущества Бога, Его Всеприсутствия и Его Божественного Провидения.',
      stage: 'Сверху',
      stageColor: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    },
    { 
      title: 'Пространство снизу', 
      instruction: 'Осознайте Божественное пространство под вами. Это сознание второго из Десяти Речений: не верить ни в какого другого бога, помимо Него. Это сознание Одного Бога Израиля.',
      stage: 'Снизу',
      stageColor: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    },
    { 
      title: 'Пространство спереди', 
      instruction: 'Осознайте Божественное пространство перед вами. Это сознание абсолютного Единства Бога. «Слушай, Израиль Авайе – Бог наш, Авайе Один».',
      stage: 'Спереди',
      stageColor: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
    },
    { 
      title: 'Пространство справа', 
      instruction: 'Осознайте Божественное пространство справа от вас. Это сознание и ощущение любви к Богу; любви всем сердцем, всей душой, всем существом своим.',
      stage: 'Справа',
      stageColor: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    },
    { 
      title: 'Пространство слева', 
      instruction: 'Осознайте Божественное пространство слева от вас. Это сознание и ощущение трепета, испытываемого в присутствии Его, Бесконечного. Да поможет нам этот трепет избавиться от всех видов отрицательной энергии.',
      stage: 'Слева',
      stageColor: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
    },
    { 
      title: 'Пространство сзади', 
      instruction: 'Осознайте Божественное пространство сзади от вас. Это сознание бдительности, постоянной готовности бороться со злом. Мы должны постоянно держать охрану возле нашей задней двери.',
      stage: 'Сзади',
      stageColor: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
    },
    { 
      title: 'Искра Машиаха', 
      instruction: 'В нашем индивидуальном Б-жественном пространстве раскроется собственная, глубоко запрятанная в нас искра Машиаха. Да удостоимся мы освободиться из нашего состояния духовного и физического изгнания.',
      stage: 'Освобождение',
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
