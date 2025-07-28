import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-intention-practice',
  imports: [],
  templateUrl: './intention-practice.component.html',
  styleUrl: './intention-practice.component.scss'
})
export class IntentionPracticeComponent {

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  startPractice() {
    // TODO: Implement practice flow
    console.log('Starting intention practice...');
    alert('Практика намерения будет реализована в следующих версиях');
  }
}
