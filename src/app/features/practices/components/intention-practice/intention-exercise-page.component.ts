import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '@app/shared/components/page-header/page-header.component';

interface IntentionPractice {
  title: string;
  description: string;
}

@Component({
  selector: 'app-intention-exercise-page',
  templateUrl: './intention-exercise-page.component.html',
  
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
})
export class IntentionExercisePageComponent implements OnInit {
  practice: IntentionPractice | undefined;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.practice = navigation.extras.state['practice'];
    }
  }

  ngOnInit(): void {
    if (!this.practice) {
      this.router.navigate(['/practices/intention']);
    }
  }

  setAsChallenge(): void {
    if (this.practice) {
      localStorage.setItem('dailyChallenge', JSON.stringify(this.practice));
      this.router.navigate(['/home']);
    }
  }

  finishPractice(): void {
    this.router.navigate(['/practices/intention']);
  }
}
