import { Component, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shabbat-practice',
  templateUrl: './shabbat-practice.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ShabbatPracticeComponent implements OnDestroy {
  isPracticeStarted = false;
  currentStepIndex = 0;
  isVoiceEnabled = false;
  userRating = 5;

  practiceSteps = [
    { 
      title: 'Подготовка', 
      instruction: 'Взаимоотношения еврейской души со святым днем Шабат подобны браку. Шабат – это «супруга» еврейской души (сама душа в данном случае играет роль мужского начала).',
      stage: 'Подготовка',
      stageColor: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    },
    { 
      title: 'Соблюдение Шабата', 
      instruction: 'Посредством соблюдения Шабата как в духовном, так и в физическом смысле мы приходим к ощущению Божественной тайны Шабата в течение всей недели; всю неделю мы предвкушаем наступление Шабата.',
      stage: 'Соблюдение',
      stageColor: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    },
    { 
      title: 'Слово Шабат', 
      instruction: 'Приступим к медитации над словом Шабат: ש ב ת. Как учит нас книга Зоар, слово Шабат – это фактически одно из Имен Бога.',
      stage: 'Имя',
      stageColor: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    },
    { 
      title: 'Три буквы', 
      instruction: 'Три буквы слова Шабат: шин, бейт и тав – стоят во главе следующих слов: «мир» Шалом שלום, «благословение» Браха ברכה, «наслаждение» Таануг תענוג.',
      stage: 'Три слова',
      stageColor: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
    },
    { 
      title: 'Мир как сосуд', 
      instruction: 'Учат мудрецы, что мир – это тот сосуд, который мы сами должны создать для получения света Божественного благословения, касающегося любой области: детей, доброго здоровья и благосостояния.',
      stage: 'Мир',
      stageColor: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    },
    { 
      title: 'Божественное наслаждение',
      instruction: 'Основным ощущением Шабата, ощущением Божественного света, вливающегося в созданный нами сосуд – мир, является ощущение Божественного наслаждения.',
      stage: 'Наслаждение',
      stageColor: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
    },
    { 
      title: 'Шабат шалом', 
      instruction: 'В Шабат мы желаем друг другу: Шабат шалом – Мирной Субботы. Или же: Шабат шалом у-меворах – Мирной и благословенной Субботы.',
      stage: 'Приветствие',
      stageColor: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
    },
    { 
      title: 'Полнота ощущения', 
      instruction: 'Да достигнем мы все в Шабат в полной мере ощущения мира, благословения и Божественного наслаждения.',
      stage: 'Полнота',
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
