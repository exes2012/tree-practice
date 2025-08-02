import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PracticeService } from '../../../../core/services/practice.service';

@Component({
  selector: 'app-specific-request-practice',
  templateUrl: './specific-request-practice.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class SpecificRequestPracticeComponent implements OnDestroy {
  isPracticeStarted = false;
  currentStepIndex = 0;
  userProblem = '';
  userRating = 5;
  isVoiceEnabled = true;

  practiceSteps = [
    { title: 'Шаг 1: Ощущение', instruction: 'Почувствуй пространство, себя, свое тело.' },
    { title: 'Шаг 2: Определение проблемы', instruction: 'С чем бы ты хотел поработать?' },
    { title: 'Шаг 3: Локализация проблемы', instruction: 'Почувствуй ярко проблему. Найди, где она ощущается в теле. Ее размер, форму. Найди, она внутри или снаружи тела. Покажи рукой в это место.' },
    { title: 'Шаг 4: Самоотмена', instruction: 'Положи руку туда, где находится это чувство. Одновременно с этим поставь руку на грудную точку и проговаривай: <br><br><strong>"Мне не важно, решится эта проблема, или нет. Мне нужна только связь с Творцом. И я здесь только для того, чтобы с ним соединиться через эту проблему."</strong> <br><br>До состояния уменьшения важности и самоотмены.' },
    { title: 'Шаг 5: Единение со страдающими', instruction: 'Попытайся почувствовать все души на земле, которые страдают от такой же проблемы. Скажи: <br><br><strong>"Все души, у которых есть подобная проблема, отпечатаны во мне. Связаны со мной".</strong>' },
    { title: 'Шаг 6: Проводник света', instruction: 'Попроси у Творца, чтобы он заполнил нехватки этих душ светом. Работай как проводник. Поднимай просьбу к Творцу, получай свет, и протягивая свет от него внутрь их нехваток. До состояния восполнения их нехваток.' },
    { title: 'Шаг 7: Видение участников', instruction: 'Попроси Творца показать, какие еще участники вовлечены в эту проблему.' },
    { title: 'Шаг 8: Свет вместо тьмы', instruction: 'Почувствуй, что любое зло, любое страдание в людях это недостаток света. Тьмы не создано. Создан недостаток света. Почувствуй, где у всех участников проблемы находится недостаток света. Проси у Творца свет, чтобы протянуть на сосуды всех, кто включен в проблему.' },
    { title: 'Шаг 9: Соединение', instruction: 'Отметь, какими ты видишь участников, вовлеченных в проблему. Каким или какой ты видишь себя. Каким ты видишь Творца в отношении этой проблемы. Проси Творца исправить твое восприятие на альтруистическое.' },
    { title: 'Шаг 10: Соединение', instruction: 'Почувствуй ещё раз всех участников, вовлечённых в эту проблему. Всех вместе. Почувствуй себя. Почувствуй Творца. Где по ощущениям он находится? Включи себя и всех вовлеченных в проблему участников в ощущение Творца. Соедини их с Творцом. Скажи: <br><br><strong>"Все, что есть - Творец.".</strong> И побудь в этом состоянии.' },
    { title: 'Шаг 11: Благодарность', instruction: 'Вырази благодарность Творцу в меру получения облегчения и изменения. <br><br><strong>"Благодарю за это общение".</strong>' },
    { title: 'Шаг 12: Оценка', instruction: 'Во сколько баллов оценишь эту проработку?' },
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
    this.practiceService.saveLastPractice({ name: 'Большое состояние - Работа с запросом', route: '/practices/man/specific-request' });
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
