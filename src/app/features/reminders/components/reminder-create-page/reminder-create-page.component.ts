import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReminderService } from '@app/core/services/reminder.service';
import {
  Reminder,
  WeekDay,
  ReminderCategory,
  REMINDER_CATEGORIES,
  WEEK_DAYS
} from '@app/core/models/reminder.models';
import { CustomTimePickerComponent } from '../../../../shared/components/custom-time-picker/custom-time-picker.component';
import { CustomSelectComponent, SelectOption } from '../../../../shared/components/custom-select/custom-select.component';


@Component({
  selector: 'app-reminder-create-page',
  imports: [CommonModule, FormsModule, CustomTimePickerComponent, CustomSelectComponent],
  templateUrl: './reminder-create-page.component.html',
  styleUrls: ['./reminder-create-page.component.scss']
})
export class ReminderCreatePageComponent implements OnInit {
  isEditing = false;
  reminderId: string | null = null;
  
  // Form data
  title = '';
  message = '';
  time = '09:00';
  selectedDays: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  category: ReminderCategory = 'practice';
  
  // Form state
  isSubmitting = false;
  errors: { [key: string]: string } = {};
  
  readonly categories = REMINDER_CATEGORIES;
  readonly weekDays = WEEK_DAYS;

  // Options for custom select
  categoryOptions: SelectOption[] = REMINDER_CATEGORIES.map(cat => ({
    value: cat.id,
    label: cat.name
  }));



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reminderService: ReminderService
  ) {}

  ngOnInit(): void {
    this.reminderId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.reminderId;
    
    if (this.isEditing && this.reminderId) {
      this.loadReminder();
    }
  }

  private async loadReminder(): Promise<void> {
    if (!this.reminderId) return;
    
    this.reminderService.reminders$.subscribe(reminders => {
      const reminder = reminders.find(r => r.id === this.reminderId);
      if (reminder) {
        this.title = reminder.title;
        this.message = reminder.message;
        this.time = reminder.time;
        this.selectedDays = [...reminder.days];
        this.category = reminder.category;
      }
    });
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
    this.selectedDays = [...this.weekDays.map(d => d.id)];
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
      if (this.isEditing && this.reminderId) {
        // Update existing reminder
        await this.reminderService.updateReminder(this.reminderId, {
          title: this.title.trim(),
          message: this.message.trim(),
          time: this.time,
          days: this.selectedDays,
          category: this.category
        });
      } else {
        // Create new reminder
        await this.reminderService.createReminder({
          title: this.title.trim(),
          message: this.message.trim(),
          time: this.time,
          days: this.selectedDays,
          category: this.category
        });
      }
      
      this.router.navigate(['/reminders']);
    } catch (error) {
      console.error('Error saving reminder:', error);
      this.errors['general'] = 'Ошибка при сохранении напоминания';
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/reminders']);
  }

  getCategoryName(categoryId: ReminderCategory): string {
    const category = this.categories.find(c => c.id === categoryId);
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
    
    if (this.selectedDays.length === 5 && weekdays.every(day => this.selectedDays.includes(day))) {
      return 'Будни';
    }
    
    if (this.selectedDays.length === 2 && weekends.every(day => this.selectedDays.includes(day))) {
      return 'Выходные';
    }
    
    return this.selectedDays
      .map(day => this.weekDays.find(d => d.id === day)?.short || day)
      .join(', ');
  }
}
