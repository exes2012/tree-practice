import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-goals-practice',
  imports: [],
  templateUrl: './goals-practice.component.html',
  styleUrl: './goals-practice.component.scss',
})
export class GoalsPracticeComponent {
  constructor(private location: Location) {}
  goBack() {
    this.location.back();
  }
  startPractice() {
    alert('Мои цели будут реализованы в следующих версиях');
  }
}
