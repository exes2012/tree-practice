import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-shekhinah-field-practice',
  templateUrl: './shekhinah-field-practice.component.html',
  standalone: true,
})
export class ShekhinahFieldPracticeComponent {

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  startPractice() {
    console.log('Starting shekhinah field practice...');
    alert('Практика будет реализована в следующих версиях');
  }
}
