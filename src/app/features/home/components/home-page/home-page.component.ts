import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  // Test data
  streak = 7;
  totalPractices = 42;
  dailyGoal = 'Сегодня сосредоточься на удержании намерения в течение 10 минут';
  lastPractice = 'Наработка намерения - вчера в 19:30';
  dailyAdvice = 'Нет ничего кроме Него. Помни об этом в каждый момент практики. Когда возникают сомнения или отвлечения, возвращайся к этой истине. Творец присутствует во всем, что происходит с тобой сейчас.';
  isAdviceExpanded = false;

  constructor(private router: Router) {}

  navigateToPractice(practiceType: string) {
    this.router.navigate(['/practices', practiceType]);
  }

  repeatLastPractice() {
    // Navigate to the last practice (for now, default to intention)
    this.navigateToPractice('intention');
  }

  toggleAdvice() {
    this.isAdviceExpanded = !this.isAdviceExpanded;
  }
}
