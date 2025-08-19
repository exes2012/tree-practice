import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ReminderService } from '@app/core/services/reminder.service';
import { DailyIntention, INTENTION_MESSAGES } from '@app/core/models/reminder.models';
import {
  CustomSelectComponent,
  SelectOption,
} from '../../../../shared/components/custom-select/custom-select.component';
import { CustomTimePickerComponent } from '../../../../shared/components/custom-time-picker/custom-time-picker.component';

interface IntentionPractice {
  title: string;
  description: string;
}

@Component({
  selector: 'app-daily-intention',
  imports: [CommonModule, FormsModule, CustomSelectComponent, CustomTimePickerComponent],
  templateUrl: './daily-intention.component.html',
  
})
export class DailyIntentionComponent implements OnInit, OnDestroy {
  intention: DailyIntention | null = null;
  currentIntention: IntentionPractice | null = null;
  isLoading = true;

  // Form data
  intervalHours = 4;
  startTime = '08:00';
  endTime = '22:00';

  readonly intervalOptions = [
    { value: 1, label: '1 час' },
    { value: 2, label: '2 часа' },
    { value: 3, label: '3 часа' },
    { value: 4, label: '4 часа' },
    { value: 5, label: '5 часов' },
    { value: 6, label: '6 часов' },
    { value: 7, label: '7 часов' },
    { value: 8, label: '8 часов' },
  ];

  // Options for custom select
  intervalSelectOptions: SelectOption[] = this.intervalOptions;

  private destroy$ = new Subject<void>();

  constructor(private reminderService: ReminderService) {}

  ngOnInit(): void {
    this.loadDailyIntention();
    this.loadCurrentIntention();
    this.checkNotificationPermission();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDailyIntention(): void {
    this.reminderService.dailyIntention$.pipe(takeUntil(this.destroy$)).subscribe((intention) => {
      this.intention = intention;
      if (intention) {
        this.intervalHours = intention.intervalHours;
      }
      this.isLoading = false;
    });
  }

  private loadCurrentIntention(): void {
    const stored = localStorage.getItem('dailyChallenge');
    if (stored) {
      try {
        this.currentIntention = JSON.parse(stored);
      } catch {
        this.currentIntention = null;
      }
    }
  }

  private async checkNotificationPermission(): Promise<void> {
    const status = this.reminderService.getNotificationPermissionStatus();
    if (status === 'default') {
      await this.reminderService.requestNotificationPermission();
    }
  }

  async toggleIntention(): Promise<void> {
    if (this.intention) {
      await this.reminderService.toggleDailyIntention();
    } else {
      await this.createIntention();
    }
  }

  async createIntention(): Promise<void> {
    await this.reminderService.createOrUpdateDailyIntention({
      intervalHours: this.intervalHours,
      startTime: this.startTime,
      endTime: this.endTime,
      useRandomMessages: true,
    });
  }

  async updateInterval(): Promise<void> {
    if (!this.intention) return;

    await this.reminderService.createOrUpdateDailyIntention({
      intervalHours: this.intervalHours,
      startTime: this.startTime,
      endTime: this.endTime,
    });
  }

  getIntervalLabel(hours: number): string {
    const option = this.intervalOptions.find((opt) => opt.value === hours);
    return option ? option.label : `${hours} часов`;
  }
}
