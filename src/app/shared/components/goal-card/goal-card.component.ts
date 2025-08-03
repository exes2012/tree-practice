import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Goal } from '@app/core/services/goal.service';

@Component({
  selector: 'app-goal-card',
  templateUrl: './goal-card.component.html',
  styleUrls: ['./goal-card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class GoalCardComponent {
  @Input() goal!: Goal;
  @Output() goalSelected = new EventEmitter<Goal>();

  onCardClick(): void {
    this.goalSelected.emit(this.goal);
  }
}
