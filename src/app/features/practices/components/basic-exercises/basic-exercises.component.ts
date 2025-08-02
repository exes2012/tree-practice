import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basic-exercises',
  templateUrl: './basic-exercises.component.html',
  styleUrls: ['./basic-exercises.component.scss']
})
export class BasicExercisesComponent {

  constructor(private location: Location, private router: Router) {}

  goBack() {
    this.location.back();
  }

  startPractice(practice: string) {
    if (practice === 'keter-tuning') {
      this.router.navigate(['/practices/basic/keter-tuning']);
    } else if (practice === 'four-stages') {
      this.router.navigate(['/practices/basic/four-stages']);
    }
  }
}
