import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-creator-justification-practice',
  templateUrl: './creator-justification-practice.component.html',
  standalone: true,
})
export class CreatorJustificationPracticeComponent {

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  startPractice() {
    console.log('Starting creator justification practice...');
    alert('Практика будет реализована в следующих версиях');
  }
}
