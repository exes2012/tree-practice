import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-space-clarification-practice',
  templateUrl: './space-clarification-practice.component.html',
  standalone: true,
})
export class SpaceClarificationPracticeComponent {

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  startPractice() {
    console.log('Starting space clarification practice...');
    alert('Практика будет реализована в следующих версиях');
  }
}
