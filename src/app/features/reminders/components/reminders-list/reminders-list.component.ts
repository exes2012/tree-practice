import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ReminderService } from '@app/core/services/reminder.service';
import { Reminder, REMINDER_CATEGORIES, getCategoryInfo } from '@app/core/models/reminder.models';

@Component({
  selector: 'app-reminders-list',
  imports: [CommonModule],
  templateUrl: './reminders-list.component.html',
  
})
export class RemindersListComponent implements OnInit, OnDestroy {
  reminders: Reminder[] = [];
  isLoading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private reminderService: ReminderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReminders();
    this.checkNotificationPermission();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadReminders(): void {
    this.reminderService.reminders$.pipe(takeUntil(this.destroy$)).subscribe((reminders) => {
      this.reminders = reminders;
      this.isLoading = false;
    });
  }

  private async checkNotificationPermission(): Promise<void> {
    const status = this.reminderService.getNotificationPermissionStatus();
    if (status === 'default') {
      await this.reminderService.requestNotificationPermission();
    }
  }

  async toggleReminder(reminder: Reminder): Promise<void> {
    await this.reminderService.toggleReminder(reminder.id);
  }

  async deleteReminder(reminder: Reminder): Promise<void> {
    if (confirm(`Удалить напоминание "${reminder.title}"?`)) {
      await this.reminderService.deleteReminder(reminder.id);
    }
  }

  editReminder(reminder: Reminder): void {
    this.router.navigate(['/reminders/edit', reminder.id]);
  }

  openAddModal(): void {
    this.router.navigate(['/reminders/new']);
  }

  getCategoryInfo(reminder: Reminder) {
    return getCategoryInfo(reminder.category);
  }

  formatTime(time: string): string {
    return time;
  }

  formatDays(days: string[]): string {
    if (days.length === 7) {
      return 'Каждый день';
    }
    if (days.length === 5 && !days.includes('saturday') && !days.includes('sunday')) {
      return 'Будни';
    }
    if (days.length === 2 && days.includes('saturday') && days.includes('sunday')) {
      return 'Выходные';
    }

    const dayNames: { [key: string]: string } = {
      monday: 'Пн',
      tuesday: 'Вт',
      wednesday: 'Ср',
      thursday: 'Чт',
      friday: 'Пт',
      saturday: 'Сб',
      sunday: 'Вс',
    };

    return days.map((day) => dayNames[day] || day).join(', ');
  }

  trackByReminderId(index: number, reminder: Reminder): string {
    return reminder.id;
  }
}
