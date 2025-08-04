import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PracticeBaseComponent } from '../../../../../shared/components/practice-base/practice-base.component';
import { PracticeShellComponent } from '../../../../../shared/components/practice-shell/practice-shell.component';
import { SpeechService } from '../../../../../shared/services/speech.service';
import { PracticeStep, PracticeConfig } from '../../../../../shared/interfaces/practice.interface';
import { Goal, GoalService, GoalPractice } from '@app/core/services/goal.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-goal-man-practice',
  templateUrl: './goal-man-practice.component.html',
  styleUrls: ['./goal-man-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PracticeShellComponent]
})
export class GoalManPracticeComponent extends PracticeBaseComponent implements OnInit {
  goal: Goal | undefined;
  goalId: string | null = null;
  practiceFormulation: string = '';
  feelingLocation: string = '';
  participantsVision: string = '';
  selfVision: string = '';

  get inputData() {
    return {
      practiceFormulation: this.practiceFormulation,
      feelingLocation: this.feelingLocation,
      participantsVision: this.participantsVision,
      selfVision: this.selfVision
    };
  }

  config: PracticeConfig = {
    title: 'Подъем МАН с целью',
    description: 'Практика подъема МАН через работу с целью'
  };

  steps: PracticeStep[] = [
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
      instruction: 'Представьте, что вы достигли цели. Найди, включается ли что-то в ощущениях помимо радости. Найди, где это чувство ощущается. Его размер, форму. Найди, они внутри или снаружи тебя. Покажи рукой в это место.',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 4: Самоотмена',
      instruction: 'Положи руку туда, где находится это чувство. Одновременно с этим поставь руку на грудную точку, и проговаривай до состояния уменьшения важности и самоотмены: <br><br><strong>{{repeatablePhrase}}</strong>',
      repeatablePhrase: 'Мне не важно, будет ли достигнута "{{goal.title}}". Мне нужна только связь с Творцом. И я здесь только для того, чтобы с Ним соединиться через эту цель.',
      buttonText: 'Далее',
      showToggleRepetition: true
    },
    {
      title: 'Шаг 5: Найдите других',
      instruction: 'Попытайся почувствовать все души в общей системе, которые страдают от не достижения этой цели. Скажи: <br><br><strong>{{repeatablePhrase}}</strong>',
      repeatablePhrase: 'Все души, которые страдают от недостижения этой цели, отпечатаны во мне. Мы связаны в одну общую систему. Их страдание — это выражение их желания, пока ещё с эгоистическим расчётом.',
      buttonText: 'Далее',
      showToggleRepetition: true
    },
    {
      title: 'Шаг 6: Проводник света',
      instruction: 'Работай как проводник. Проси об исправлении намерения в их желаниях и притягивай в исправленные сосуды благо и наслаждение.<br><br><strong>{{repeatablePhrase}}</strong>',
      repeatablePhrase: 'Творец, исправь их намерение из получения в отдачу, приблизь их к себе и наполни их нехватки благом и наслаждением.',
      buttonText: 'Далее',
      showToggleRepetition: true
    },
    {
      title: 'Шаг 7: Видение участников',
      instruction: 'Попроси Творца показать, какие еще участники вовлечены в "{{goal.title}}".',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 8: Свет вместо тьмы',
      instruction: 'Отметь, какими ты видишь участников, связанных с "{{goal.title}}". Проси Творца исправить намерение внутри желаний всех участников, связанных с этой целью. Скажи: <br><br><strong>{{repeatablePhrase}}</strong>',
      buttonText: 'Далее',
      repeatablePhrase: 'Творец, исправь намерения внутри желаний всех участников, связанных с "{{goal.title}}" из получения в отдачу, приблизь их к себе и наполни их нехватки благом и наслаждением.',
    },
        {
      title: 'Шаг 9: Соединение',
      instruction: 'Отметь, каким ты видишь себя в отношении "{{goal.title}}". Проси Творца: <br><br><strong>{{repeatablePhrase}}</strong>',
      buttonText: 'Далее',
      repeatablePhrase: 'Творец, исправь мое намерение, связанное с  "{{goal.title}}" и другими душами. Чтобы оно было ради связи, ради отдачи, ради Тебя.',
    },
    {
      title: 'Шаг 10: Соединение',
      instruction: 'Почувствуй ещё раз всех участников, связанных "{{goal.title}}", и саму эту цель. Собери все это воедино. Подними ощущение этих души и эту цель туда, где ощущается Творец, и удерживай эти ощущения там. Скажи: <br><br><strong>{{repeatablePhrase}}</strong>',
      repeatablePhrase: 'Все, что существует внутри этой системы, включая саму эту цель, включая мое желание - и есть Творец.',
      buttonText: 'Закончить',
      showToggleRepetition: true
    },
    {
      title: 'Шаг 11: Оценка',
      instruction: 'Оцените проработку от 1 до 10.',
      buttonText: 'Завершить',
      showRating: true
    }
  ];

  constructor(
    router: Router,
    speechService: SpeechService,
    private route: ActivatedRoute,
    private goalService: GoalService
  ) {
    super(router, speechService);
  }

  initializePractice(): void {
    this.goalId = this.route.snapshot.paramMap.get('id');
    if (this.goalId) {
      this.goal = this.goalService.getGoalById(this.goalId);
      if (this.goal) {
        this.practiceFormulation = this.goal.title;
        this.steps[1].initialValue = this.goal.title;
      }
    }
  }

  onPracticeFinished(rating: number): void {
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

  getProcessedInstruction(step: PracticeStep): string {
    let instruction = step.instruction;

    // Replace goal.title placeholder
    if (this.goal) {
      instruction = instruction.replace(/\{\{goal\.title\}\}/g, this.goal.title);
    }

    // Replace other placeholders
    instruction = instruction.replace(/\{\{practiceFormulation\}\}/g, this.practiceFormulation);
    instruction = instruction.replace(/\{\{feelingLocation\}\}/g, this.feelingLocation);
    instruction = instruction.replace(/\{\{participantsVision\}\}/g, this.participantsVision);
    instruction = instruction.replace(/\{\{selfVision\}\}/g, this.selfVision);

    // Replace repeatablePhrase placeholder
    if (step.repeatablePhrase) {
      let repeatablePhrase = this.getProcessedRepeatablePhrase(step);
      instruction = instruction.replace(/\{\{repeatablePhrase\}\}/g, repeatablePhrase);
    }

    return instruction;
  }

  getProcessedRepeatablePhrase(step: PracticeStep): string {
    let phrase = step.repeatablePhrase || '';

    // Replace goal.title placeholder
    if (this.goal) {
      phrase = phrase.replace(/\{\{goal\.title\}\}/g, this.goal.title);
    }

    // Replace practiceFormulation placeholder
    phrase = phrase.replace(/\{\{practiceFormulation\}\}/g, this.practiceFormulation);

    // Replace feelingLocation placeholder
    phrase = phrase.replace(/\{\{feelingLocation\}\}/g, this.feelingLocation);

    // Replace participantsVision placeholder
    phrase = phrase.replace(/\{\{participantsVision\}\}/g, this.participantsVision);

    // Replace selfVision placeholder
    phrase = phrase.replace(/\{\{selfVision\}\}/g, this.selfVision);

    return phrase;
  }

  onInputChanged(event: {field: string, value: any}): void {
    switch(event.field) {
      case 'practiceFormulation':
        this.practiceFormulation = event.value;
        break;
      case 'feelingLocation':
        this.feelingLocation = event.value;
        break;
      case 'participantsVision':
        this.participantsVision = event.value;
        break;
      case 'selfVision':
        this.selfVision = event.value;
        break;
    }
  }
}
