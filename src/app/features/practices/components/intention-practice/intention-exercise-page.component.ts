import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Navigation } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';

interface IntentionPractice {
  title: string;
  description: string;
}

@Component({
  selector: 'app-intention-exercise-page',
  templateUrl: './intention-exercise-page.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class IntentionExercisePageComponent implements OnInit {
  practice: IntentionPractice | undefined;

  constructor(
    private router: Router,
    private location: Location
  ) {
    const navigation: Navigation | null = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.practice = navigation.extras.state['practice'];
    }
  }

  ngOnInit(): void {
    if (!this.practice) {
      // If the page is reloaded or accessed directly, the state will be lost.
      // We can redirect back or to a safe page.
      this.router.navigate(['/practices/intention']);
    }
  }

  goBack(): void {
    this.location.back();
  }

  setAsChallenge(): void {
    if (this.practice) {
      localStorage.setItem('dailyChallenge', JSON.stringify(this.practice));
      this.router.navigate(['/home']);
    }
  }
}
