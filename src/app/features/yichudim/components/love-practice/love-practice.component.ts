import { Component, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-love-practice',
  templateUrl: './love-practice.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LovePracticeComponent implements OnDestroy {
  isPracticeStarted = false;
  currentStepIndex = 0;
  isVoiceEnabled = false;
  userRating = 5;

  practiceSteps = [
    { 
      title: 'Подготовка', 
      instruction: 'Любовь есть Божественная способность к творению. Сосредоточимся, чтобы пробудить эту способность в нашей собственной душе.',
      stage: 'Подготовка',
      stageColor: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    },
    { 
      title: 'Произнесение слова', 
      instruction: 'Пусть ивритское слово ахава – «любовь» – отзовется в нашем сердце и зазвучит в наших устах: а-ха-ва. Произносите медленно и вслушивайтесь в звучание.',
      stage: 'Звучание',
      stageColor: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    },
    { 
      title: 'Визуализация букв', 
      instruction: 'Теперь мысленно представим себе слово ахава: א ה ב ה. Четыре буквы этого слова – алеф, хей, бейт и хей – это первая, пятая, вторая и пятая буквы ивритского алфавита.',
      stage: 'Буквы',
      stageColor: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    },
    { 
      title: 'Гиматрия единства', 
      instruction: 'Сумма их числовых значений – гиматрия – равна 13. Это же число – 13 – есть также числовое значение слова «один», эхад: א ח ד. Почувствуйте связь между любовью и единством.',
      stage: 'Единство',
      stageColor: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
    },
    { 
      title: 'Ощущение единства', 
      instruction: 'Любовь – это ощущение единства с любимым; это чувство, побуждающее нас стать близким ему, вплоть до полного единения. Давайте почувствуем, что мы есть одно целое с Творцом и со всем Его творением.',
      stage: 'Единение',
      stageColor: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    },
    { 
      title: 'Аббревиатура света', 
      instruction: 'Продолжим медитацию над словом ахава. Четыре его буквы составляют аббревиатуру фразы אור הקדוש ברוך הוא «Свет Святого Благословенного» (Ор а-Кадош Барух ху).',
      stage: 'Свет',
      stageColor: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
    },
    { 
      title: 'Излучение любви', 
      instruction: 'Своим Бесконечным светом, Своей любовью ко всем Бог непрерывно заново творит мир. Да будем и мы идти Его путями и излучать из наших душ животворящую силу любви.',
      stage: 'Творение',
      stageColor: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
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
