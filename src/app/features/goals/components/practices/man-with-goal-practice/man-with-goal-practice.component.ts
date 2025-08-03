import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal, GoalService, GoalPractice } from '@app/core/services/goal.service';
import { PracticeLayoutComponent } from '@app/shared/components/practice-layout/practice-layout.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-man-with-goal-practice',
  templateUrl: './man-with-goal-practice.component.html',
  styleUrls: ['./man-with-goal-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PracticeLayoutComponent]
})
export class ManWithGoalPracticeComponent implements OnInit {
  goal: Goal | undefined;
  goalId: string | null = null;
  practiceFormulation: string = '';
  feelingLocation: string = '';
  participantsVision: string = '';
  selfVision: string = '';
  currentStepIndex: number = 0;
  isRepetitionActive: boolean = false;

  steps = [
    {
      title: 'Шаг 1: Ощущение',
      instruction: 'Почувствуй пространство, себя, свое тело.',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 2: Определение цели',
      instruction: 'Какую цель ты бы хотел проработать?',
      inputField: 'practiceFormulation',
      initialValue: '',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 3: Локализация чувств',
      instruction: 'Представьте, что вы достигли цели. Найди, включается ли что-то в ощущениях помимо радости. Найди, где это чувство ощущается в теле. Его размер, форму. Найди, они внутри или снаружи тела. Покажи рукой в это место.',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 4: Самоотмена',
      instruction: 'Положи руку туда, где находится это чувство. Одновременно с этим поставь руку на грудную точку, и проговаривай до состояния уменьшения важности и самоотмены: "Мне не важно, будет ли достигнута "{{goal.title}}". Мне нужна только связь с Творцом. И я здесь только для того, чтобы соединиться с Ним через эту цель."',
      repeatablePhrase: 'Мне не важно, будет ли достигнута "{{goal.title}}". Мне нужна только связь с Творцом. И я здесь только для того, чтобы с Ним соединиться через эту проработку.',
      buttonText: 'Далее',
      showToggleRepetition: true
    },
    {
      title: 'Шаг 5: Найдите других',
      instruction: 'Попытайся почувствовать все души в общей системе, которые страдают от не достижения этой цели. Скажи: "Все души в общей системе, которые страдают от недостижения этой цели, отпечатаны во мне. Связаны со мной. Мы все - часть одной общей системы."',
      repeatablePhrase: 'Все души в общей системе, которые страдают от недостижения этой цели, отпечатаны во мне. Связаны со мной. Мы все - часть одной общей системы.',
      buttonText: 'Далее',
      showToggleRepetition: true
    },
    {
      title: 'Шаг 6: Проводник света',
      instruction: 'Попроси у Творца, чтобы он заполнил нехватки этих душ светом. Работай как проводник. Поднимай просьбу к Творцу, получай свет и протягивай свет от Него внутрь их нехваток. До состояния восполнения их нехваток. "Творец, исправь их сосуд и заполни их светом. Дай "{{goal.title}}" им, а не мне в первую очередь."',
      repeatablePhrase: 'Творец, исправь их сосуд и заполни их светом. Дай "{{goal.title}}" им, а не мне в первую очередь.',
      buttonText: 'Далее',
      showToggleRepetition: true
    },
    {
      title: 'Шаг 7: Видение участников',
      instruction: 'Попроси Творца показать, какие еще участники вовлечены в "{{goal.title}}".',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 8: Соединение',
      instruction: 'Отметь, какими ты видишь участников, связанных с "{{goal.title}}". Каким или какой ты видишь себя. Каким ты видишь Творца в отношении этой проблемы. Проси Творца исправить твое восприятие на альтруистическое.',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 9: Соединение',
      instruction: 'Почувствуй ещё раз всех участников, вовлечённых в "{{goal.title}}", все их сосуды. Почувствуй "{{goal.title}}". Собери все это воедино. Подними ощущение этих души и эту цель туда, где ощущается Творец, и удерживай эти ощущения там. Скажи: "Все, что существует, включая эту цель - и есть Творец."',
      repeatablePhrase: 'Все, что существует, включая эту цель - и есть Творец.',
      buttonText: 'Закончить',
      showToggleRepetition: true
    },
    {
      title: 'Шаг 10: Оценка',
      instruction: 'Оцените проработку от 1 до 10.',
      inputField: 'userRating',
      buttonText: 'Завершить',
      showRating: true
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private goalService: GoalService
  ) { }

  ngOnInit(): void {
    this.goalId = this.route.snapshot.paramMap.get('id');
    if (this.goalId) {
      this.goal = this.goalService.getGoalById(this.goalId);
      if (this.goal) {
        this.practiceFormulation = this.goal.title;
        this.steps[0].initialValue = this.goal.title;
      }
    }
  }

  onPracticeFinished(event: { rating: number }): void {
    if (this.goalId && this.goal) {
      const newPractice: GoalPractice = {
        id: uuidv4(),
        type: 'Подъем МАН с целью',
        formulation: this.practiceFormulation,
        date: new Date().toISOString().split('T')[0]
      };
      this.goalService.addPracticeToGoal(this.goalId, newPractice);
      this.router.navigate(['/goals', this.goalId]);
    }
  }

  onNextStepClicked(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
    }
    this.speak(this.getInstruction(this.steps[this.currentStepIndex]));
  }

  onPreviousStepClicked(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
    this.speak(this.getInstruction(this.steps[this.currentStepIndex]));
  }

  onToggleRepetitionClicked(isActive: boolean): void {
    this.isRepetitionActive = isActive;
    const currentStep = this.steps[this.currentStepIndex];
    if (this.isRepetitionActive && currentStep?.repeatablePhrase) {
      this.speak(this.getRepeatablePhrase(currentStep), true);
    } else {
      window.speechSynthesis.cancel();
    }
  }

  private speak(text: string, isRepetition: boolean = false) {
    if (!text) return;
    if (!isRepetition) {
        window.speechSynthesis.cancel();
    }
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  getInstruction(step: any): string {
    let instruction = step.instruction;
    if (this.goal) {
      instruction = instruction.replace(/\{\{goal.title\}\}/g, this.goal.title);
    }
    return instruction;
  }

  getRepeatablePhrase(step: any): string {
    let phrase = step.repeatablePhrase;
    if (this.goal) {
      phrase = phrase.replace(/\{\{goal.title\}\}/g, this.goal.title);
    }
    return phrase;
  }
}
