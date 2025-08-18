
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PracticeCard {
  title: string;
  route: string;
  icon: string;
  colorClass: string;
  tagColorClass?: string;
  author?: string;
  disabled?: boolean;
  data?: any;
}

@Component({
  selector: 'app-practice-list',
  templateUrl: './practice-list.component.html',
  styleUrls: ['./practice-list.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PracticeListComponent {
  @Input() practices: PracticeCard[] = [];
  @Output() practiceSelected = new EventEmitter<PracticeCard>();

  onPracticeClick(practice: PracticeCard) {
    if (!practice.disabled) {
      this.practiceSelected.emit(practice);
    }
  }

  getIconBackgroundColor(practice: PracticeCard): string {
    // Определяем цвет фона иконки на основе типа практики
    if (practice.colorClass.includes('yellow')) {
      return 'rgba(180, 83, 9, 0.1)'; // Янтарный для базовых
    } else if (practice.colorClass.includes('green')) {
      return 'rgba(34, 197, 94, 0.1)'; // Зелёный для малого состояния
    } else if (practice.colorClass.includes('blue')) {
      return 'rgba(59, 74, 92, 0.1)'; // Синий логина для остальных
    } else if (practice.colorClass.includes('purple')) {
      return 'rgba(139, 92, 246, 0.1)'; // Фиолетовый для ихудим
    } else if (practice.colorClass.includes('indigo')) {
      return 'rgba(99, 102, 241, 0.1)'; // Индиго для намерения
    } else if (practice.colorClass.includes('red')) {
      return 'rgba(244, 63, 94, 0.1)'; // Красный для МАН
    } else if (practice.colorClass.includes('pink')) {
      return 'rgba(236, 72, 153, 0.1)'; // Розовый для целей
    }
    return 'rgba(59, 74, 92, 0.1)'; // По умолчанию цвет логина
  }

  getIconColor(practice: PracticeCard): string {
    // Определяем цвет иконки на основе типа практики
    if (practice.colorClass.includes('yellow')) {
      return '#B45309'; // Янтарный для базовых
    } else if (practice.colorClass.includes('green')) {
      return '#16A34A'; // Зелёный для малого состояния
    } else if (practice.colorClass.includes('blue')) {
      return '#3B4A5C'; // Синий логина для остальных
    } else if (practice.colorClass.includes('purple')) {
      return '#7C3AED'; // Фиолетовый для ихудим
    } else if (practice.colorClass.includes('indigo')) {
      return '#6366F1'; // Индиго для намерения
    } else if (practice.colorClass.includes('red')) {
      return '#DC2626'; // Красный для МАН
    } else if (practice.colorClass.includes('pink')) {
      return '#DB2777'; // Розовый для целей
    }
    return '#3B4A5C'; // По умолчанию цвет логина
  }
}
