import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReminderService } from '@app/core/services/reminder.service';
import {
  Reminder,
  WeekDay,
  ReminderCategory,
  REMINDER_CATEGORIES,
  WEEK_DAYS,
} from '@app/core/models/reminder.models';

@Component({
  selector: 'app-reminder-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './reminder-form.component.html',
  styleUrls: ['./reminder-form.component.scss'],
})
export class ReminderFormComponent implements OnInit {
  @Input() reminder: Reminder | null = null;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  // Form data
  title = '';
  message = '';
  time = '09:00';
  selectedDays: WeekDay[] = [];
  category: ReminderCategory = 'practice';

  // Form state
  isSubmitting = false;
  errors: { [key: string]: string } = {};

  readonly categories = REMINDER_CATEGORIES;
  readonly weekDays = WEEK_DAYS;

  constructor(private reminderService: ReminderService) {}

  ngOnInit(): void {
    if (this.reminder) {
      this.title = this.reminder.title;
      this.message = this.reminder.message;
      this.time = this.reminder.time;
      this.selectedDays = [...this.reminder.days];
      this.category = this.reminder.category;
    } else {
      // Default to weekdays for new reminders
      this.selectedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    }
  }

  toggleDay(day: WeekDay): void {
    const index = this.selectedDays.indexOf(day);
    if (index > -1) {
      this.selectedDays.splice(index, 1);
    } else {
      this.selectedDays.push(day);
    }
  }

  isDaySelected(day: WeekDay): boolean {
    return this.selectedDays.includes(day);
  }

  selectAllDays(): void {
    this.selectedDays = [...this.weekDays.map((d) => d.id)];
  }

  selectWeekdays(): void {
    this.selectedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  }

  selectWeekends(): void {
    this.selectedDays = ['saturday', 'sunday'];
  }

  clearDays(): void {
    this.selectedDays = [];
  }

  private validateForm(): boolean {
    this.errors = {};

    if (!this.title.trim()) {
      this.errors['title'] = 'Название обязательно';
    }

    if (!this.message.trim()) {
      this.errors['message'] = 'Текст напоминания обязателен';
    }

    if (this.selectedDays.length === 0) {
      this.errors['days'] = 'Выберите хотя бы один день';
    }

    if (!this.time) {
      this.errors['time'] = 'Время обязательно';
    }

    return Object.keys(this.errors).length === 0;
  }

  async onSubmit(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    try {
      if (this.reminder) {
        // Update existing reminder
        await this.reminderService.updateReminder(this.reminder.id, {
          title: this.title.trim(),
          message: this.message.trim(),
          time: this.time,
          days: this.selectedDays,
          category: this.category,
        });
      } else {
        // Create new reminder
        await this.reminderService.createReminder({
          title: this.title.trim(),
          message: this.message.trim(),
          time: this.time,
          days: this.selectedDays,
          category: this.category,
        });
      }

      this.save.emit();
    } catch (error) {
      console.error('Error saving reminder:', error);
      this.errors['general'] = 'Ошибка при сохранении напоминания';
    } finally {
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getCategoryIcon(categoryId: ReminderCategory): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category?.icon || 'notifications';
  }

  getCategoryName(categoryId: ReminderCategory): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  }

  getSelectedDaysText(): string {
    if (this.selectedDays.length === 0) {
      return 'Дни не выбраны';
    }

    if (this.selectedDays.length === 7) {
      return 'Каждый день';
    }

    const weekdays: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const weekends: WeekDay[] = ['saturday', 'sunday'];

    if (
      this.selectedDays.length === 5 &&
      weekdays.every((day) => this.selectedDays.includes(day))
    ) {
      return 'Будни';
    }

    if (
      this.selectedDays.length === 2 &&
      weekends.every((day) => this.selectedDays.includes(day))
    ) {
      return 'Выходные';
    }

    return this.selectedDays
      .map((day) => this.weekDays.find((d) => d.id === day)?.short || day)
      .join(', ');
  }
}
