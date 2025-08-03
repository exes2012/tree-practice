
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
}
