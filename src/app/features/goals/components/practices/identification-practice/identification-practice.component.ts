import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Goal, GoalService, GoalPractice } from '@app/core/services/goal.service';
import { PracticeLayoutComponent } from '@app/shared/components/practice-layout/practice-layout.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-identification-practice',
  templateUrl: './identification-practice.component.html',
  styleUrls: ['./identification-practice.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PracticeLayoutComponent]
})
export class IdentificationPracticeComponent implements OnInit {
  goal: Goal | undefined;
  goalId: string | null = null;
  currentStepIndex: number = 0;
  practiceFormulation: string = '';
  imageAnalysis: string = '';
  reasonForConcern: string = '';
  questionsToHelp: string = '';
  installationFormulation: string = '';
  isRepetitionActive: boolean = false;

  steps = [
    {
      title: 'Шаг 1: Определение цели',
      instruction: 'Чего вы хотите достичь',
      inputField: 'practiceFormulation',
      initialValue: '', // Will be set from goal.title
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 2: Убираем сопротивление',
      instruction: 'Можно мне было не хотеть "{{goal.title}}". Мне так было можно и мне это было для чего-то нужно. Я сам не хотел(а) "{{goal.title}}". Можно мне было не хотеть. У меня была на то причина. У меня была причина не хотеть "{{goal.title}}". Мне так было можно.',
      repeatablePhrase: 'Можно мне было не хотеть "{{goal.title}}". Мне так было можно.',
      buttonText: 'Далее',
      showToggleRepetition: true
    },
    {
      title: 'Шаг 3: Смотрим образ',
      instruction: 'У меня уже есть "{{goal.title}}". Что вы при этом видите? Не анализируйте образ, просто почувствуйте его, а затем опишите.',
      inputField: 'imageAnalysis',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 4: Находим причину',
      instruction: 'Что смущает в образе?',
      inputField: 'reasonForConcern',
      buttonText: 'Далее',
      alternativeButton: 'Не могу понять что смущает',
      alternativeAction: () => this.onNextStepClicked(4) // Skip to questions to help
    },
    {
      title: 'Шаг 5: Вопросы чтобы вам помочь',
      instruction: 'Вопросы чтобы вам помочь: Какие эмоции у меня вызывает то, что я вижу? Как то, что я вижу, связано с моим сознательным запросом?',
      inputField: 'questionsToHelp',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 6: Формируем установку',
      instruction: 'Дополните формулу "Если у меня будет "{{goal.title}}", то..." - тем неприятным, что нашли в образе или ощущениях.',
      inputField: 'installationFormulation',
      initialValue: 'Если у меня будет "{{goal.title}}", то ',
      buttonText: 'Далее'
    },
    {
      title: 'Шаг 7: Проработка установки',
      instruction: 'Можно мне было думать, что если у меня будет "{{goal.title}}", то "{{installationFormulation}}". Но только я так думал(а). Это была только моя установка, только моя. Мне можно было ею пользоваться, но она была только моя.',
      repeatablePhrase: 'Можно мне было думать, что если у меня будет "{{goal.title}}", то "{{installationFormulation}}".',
      buttonText: 'Закончить',
      showToggleRepetition: true
    },
    {
      title: 'Шаг 8: Оценка',
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
        this.practiceFormulation = this.goal.title; // Set initial value for the first step
        this.steps[0].initialValue = this.goal.title;
        this.steps[5].initialValue = `Если у меня будет "${this.goal.title}", то `;
      }
    }
  }

  onPracticeFinished(event: { rating: number }): void {
    if (this.goalId && this.goal) {
      const newPractice: GoalPractice = {
        id: uuidv4(),
        type: 'Выявление установки',
        formulation: this.practiceFormulation, // Or a summary of the practice
        date: new Date().toISOString().split('T')[0]
      };
      this.goalService.addPracticeToGoal(this.goalId, newPractice);
      this.router.navigate(['/goals', this.goalId]);
    }
  }

  onNextStepClicked(targetStep?: number): void {
    if (targetStep !== undefined) {
      this.currentStepIndex = targetStep;
    } else if (this.currentStepIndex < this.steps.length - 1) {
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

  // Helper to get dynamic instruction text
  getInstruction(step: any): string {
    let instruction = step.instruction;
    if (this.goal) {
      instruction = instruction.replace(/\{\{goal.title\}\}/g, this.goal.title);
    }
    // For step 7, replace installationFormulation placeholder
    if (this.installationFormulation) {
      // Extract only the part after "Если у меня будет "goal", то "
      const prefix = `Если у меня будет "${this.goal?.title}", то `;
      const installationText = this.installationFormulation.startsWith(prefix)
        ? this.installationFormulation.substring(prefix.length)
        : this.installationFormulation;
      instruction = instruction.replace(/\{\{installationFormulation\}\}/g, installationText);
    }
    return instruction;
  }

  // Helper to get dynamic repeatable phrase
  getRepeatablePhrase(step: any): string {
    let phrase = step.repeatablePhrase;
    if (this.goal) {
      phrase = phrase.replace(/\{\{goal.title\}\}/g, this.goal.title);
    }
    // For step 7, replace installationFormulation placeholder
    if (this.installationFormulation) {
      // Extract only the part after "Если у меня будет "goal", то "
      const prefix = `Если у меня будет "${this.goal?.title}", то `;
      const installationText = this.installationFormulation.startsWith(prefix)
        ? this.installationFormulation.substring(prefix.length)
        : this.installationFormulation;
      phrase = phrase.replace(/\{\{installationFormulation\}\}/g, installationText);
    }
    return phrase;
  }
}
