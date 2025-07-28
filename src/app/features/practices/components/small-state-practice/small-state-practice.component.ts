import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-small-state-practice',
  imports: [],
  templateUrl: './small-state-practice.component.html',
  styleUrl: './small-state-practice.component.scss'
})
export class SmallStatePracticeComponent {

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  startPractice() {
    console.log('Starting small state practice...');
    alert('Наработка малого состояния будет реализована в следующих версиях');
  }
}
