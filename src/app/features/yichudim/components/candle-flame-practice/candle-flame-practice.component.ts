import { Component, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candle-flame-practice',
  templateUrl: './candle-flame-practice.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CandleFlamePracticeComponent implements OnDestroy {
  isPracticeStarted = false;
  currentStepIndex = 0;
  isVoiceEnabled = false;
  userRating = 5;

  practiceSteps = [
    { 
      title: 'Подготовка', 
      instruction: 'Обратимся к медитации над словами царя Шломо в Книге Мишлей (Притч): «Душа человека – свеча Бога».',
      stage: 'Подготовка',
      stageColor: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    },
    { 
      title: 'Пламя в движении', 
      instruction: 'Пламя свечи все время живо и находится в движении, качаясь в разные стороны. Иногда эти колебания очень сильны, иногда – почти незаметны.',
      stage: 'Движение',
      stageColor: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    },
    { 
      title: 'Душа как пламя', 
      instruction: 'Такие же движения совершает живая человеческая душа, свеча Бога: она все время колеблется в разные стороны, стремясь вернуться к своему источнику, Бесконечному Свету Бога.',
      stage: 'Душа',
      stageColor: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    },
    { 
      title: 'Тело и душа', 
      instruction: 'В этом физическом мире душа облечена в тело, поэтому колебания души приводят к соответствующим колебаниям тела.',
      stage: 'Связь',
      stageColor: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
    },
    { 
      title: 'Раскачивание вперед-назад', 
      instruction: 'Давайте встанем прямо и будем раскачиваться. Сначала будем раскачиваться вперед–назад. Такое направление раскачивания отражает мужской аспект нашей души.',
      stage: 'Мужской аспект',
      stageColor: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    },
    { 
      title: 'Раскачивание вправо-влево', 
      instruction: 'Теперь будем раскачиваться вправо–влево. Раскачивание в этом направлении отражает женский аспект нашей души. Если вы раскачиваетесь стоя, тело должно сгибаться в пояснице.',
      stage: 'Женский аспект',
      stageColor: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
    },
    { 
      title: 'Тора и молитва', 
      instruction: 'Естественные колебательные движения души, подобные движениям пламени свечи, наиболее ярко проявляются при изучении святой Торы или при молитве из глубины сердца.',
      stage: 'Святость',
      stageColor: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
    },
    { 
      title: 'Стремление к Свету', 
      instruction: 'Искра Б-га в нас, пламя нашей души, всегда стремится вернуться к Б-жественному Бесконечному Свету и слиться с Ним. Пусть эта искра непрестанно разгорается ярче и ярче. Как бы ни мы колебались, любое наше движение направлено к Тебе.',
      stage: 'Единение',
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
