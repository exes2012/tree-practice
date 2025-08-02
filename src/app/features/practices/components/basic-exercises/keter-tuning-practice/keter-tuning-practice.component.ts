import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PracticeService } from '@app/core/services/practice.service';

@Component({
  selector: 'app-keter-tuning-practice',
  templateUrl: './keter-tuning-practice.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class KeterTuningPracticeComponent implements OnDestroy {
  isPracticeStarted = false;
  currentStepIndex = 0;
  userRating = 5;
  isVoiceEnabled = true;

  practiceSteps = [
    { title: 'Шаг 1.1: Осознайте свою природу', instruction: 'Поймите, что ваше естественное состояние — думать о себе и своих желаниях. Для практики это нужно сознательно изменить.' },
    { title: 'Шаг 1.2: Выберите объект отдачи', instruction: 'Мысленно выберите кого-то, кто вам по-настоящему дорог. Это должен быть конкретный человек (или существо), к которому вы испытываете тёплые чувства. Абстрактные идеи («всё человечество») на начальном этапе работают хуже.' },
    { title: 'Шаг 1.3: Сконцентрируйтесь на желании насладить', instruction: 'Это ключевой момент. Ваша задача — не просто думать об этом человеке, а активно захотеть насладить его. Подумайте: «Что я могу сделать, чтобы вызвать в нём радость, кайф? Как я могу его наполнить?» Проживите это желание. Само это обдумывание, где вы свою природу (желание) используете для блага другого, и есть создание правильного намерения.' },
    { title: 'Шаг 2.1: Начните добавлять Стремление', instruction: 'Удерживая мысль о наслаждении другого, начните прикладывать внутреннее усилие, направленное от себя к этому человеку. «Потихонечку добавляй стремление, потихонечку, но в постоянстве». Это не разовый толчок, а начало непрерывного, аккуратного потока энергии вовне.' },
    { title: 'Шаг 2.2: Ощутите первый ответ Света', instruction: 'Продолжая это постоянное стремление в отдачу, вы начнёте ощущать тонкое, приятное чувство — это и есть «свет», наслаждение от самого свойства отдачи, которое к вам приходит.' },
    { title: 'Шаг 2.3: Усильте ощущение через «Рывок»', instruction: 'Это главный технический приём для углубления стадии Кетер. Когда вы чувствуете свет, сделайте осознанный, но аккуратный рывок стремления — короткое, чуть более интенсивное усилие в том же направлении, вовне. Скажите себе мысленно: «Насладись сильнее».' },
    { title: 'Шаг 2.4: Наблюдайте за реакцией', instruction: 'Вы увидите, что в ответ на этот рывок свет мгновенно приходит ярче. Это прямое доказательство того, что Свет конкретно реагирует на ваше стремление. Повторите несколько раз: постоянное стремление -> аккуратный рывок -> усиление света. Так вы учитесь управлять этим состоянием.' },
    { title: 'Оценка', instruction: 'Во сколько баллов оценишь эту проработку?' },
  ];

  constructor(private location: Location, private practiceService: PracticeService) {}

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
    if (!this.isVoiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, ''));
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  startPractice() {
    this.isPracticeStarted = true;
    this.speak(this.practiceSteps[this.currentStepIndex].instruction);
  }

  nextStep() {
    if (this.currentStepIndex < this.practiceSteps.length - 1) {
      this.currentStepIndex++;
      if (this.currentStepIndex < this.practiceSteps.length - 1) {
        this.speak(this.practiceSteps[this.currentStepIndex].instruction);
      }
    }
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.speak(this.practiceSteps[this.currentStepIndex].instruction);
    }
  }

  finishPractice() {
    this.practiceService.saveLastPractice({ name: 'Настройка на свет', route: '/practices/basic/keter-tuning' });
    this.practiceService.recordPracticeCompletion();
    this.goBack();
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
