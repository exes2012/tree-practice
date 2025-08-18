import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RemindersListComponent } from '../reminders-list/reminders-list.component';
import { DailyIntentionComponent } from '../daily-intention/daily-intention.component';

type TabType = 'reminders' | 'intention';

@Component({
  selector: 'app-reminders-page',
  imports: [CommonModule, RemindersListComponent, DailyIntentionComponent],
  templateUrl: './reminders-page.component.html',
  styleUrl: './reminders-page.component.scss'
})
export class RemindersPageComponent implements OnInit {
  activeTab: TabType = 'reminders';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize component
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
