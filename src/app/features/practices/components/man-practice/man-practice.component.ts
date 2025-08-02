import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-man-practice',
  templateUrl: './man-practice.component.html',
})
export class ManPracticeComponent {

  constructor(private location: Location, private router: Router) {}

  goBack() {
    this.location.back();
  }

  startPractice(practiceType: string) {
    this.router.navigate(['/practices/man', practiceType]);
  }
}