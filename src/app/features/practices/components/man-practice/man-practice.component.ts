import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-man-practice',
  imports: [],
  templateUrl: './man-practice.component.html',
  styleUrl: './man-practice.component.scss'
})
export class ManPracticeComponent {
  constructor(private location: Location) {}
  goBack() { this.location.back(); }
  startPractice() { alert('Проработка МАН будет реализована в следующих версиях'); }
}
