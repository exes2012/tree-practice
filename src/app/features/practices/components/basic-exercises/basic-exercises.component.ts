import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-basic-exercises',
  imports: [],
  templateUrl: './basic-exercises.component.html',
  styleUrl: './basic-exercises.component.scss'
})
export class BasicExercisesComponent {

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  startPractice() {
    console.log('Starting basic exercises...');
    alert('Базовые упражнения будут реализованы в следующих версиях');
  }
}
