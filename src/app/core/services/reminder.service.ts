import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { setSetting, getSetting, setData, getData, deleteData } from './db.service';
import {
  Reminder,
  DailyIntention,
  CreateReminderRequest,
  UpdateReminderRequest,
  CreateDailyIntentionRequest,
  UpdateDailyIntentionRequest,
  WeekDay,
  getRandomIntentionMessage,
} from '../models/reminder.models';

@Injectable({ providedIn: 'root' })
export class ReminderService {
  private remindersSubject = new BehaviorSubject<Reminder[]>([]);
  private dailyIntentionSubject = new BehaviorSubject<DailyIntention | null>(null);
  private activeTimers = new Map<string, any>();

  public reminders$ = this.remindersSubject.asObservable();
  public dailyIntention$ = this.dailyIntentionSubject.asObservable();

  constructor(private zone: NgZone) {}

  async init(): Promise<void> {
    await this.loadReminders();
    await this.loadDailyIntention();
    await this.scheduleAllReminders();

    // Legacy mood reminder support
    const moodReminderTime = await getSetting('moodReminderTime');
    if (moodReminderTime) {
      this.scheduleMoodReminder(moodReminderTime);
    }
  }

  // Reminders CRUD operations
  async createReminder(request: CreateReminderRequest): Promise<Reminder> {
    const reminder: Reminder = {
      id: this.generateId(),
      title: request.title,
      message: request.message,
      time: request.time,
      days: request.days,
      isEnabled: true,
      category: request.category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const reminders = this.remindersSubject.value;
    const updatedReminders = [...reminders, reminder];

    await setData('reminders', updatedReminders);
    this.remindersSubject.next(updatedReminders);

    if (reminder.isEnabled) {
      this.scheduleReminder(reminder);
    }

    return reminder;
  }

  async updateReminder(id: string, request: UpdateReminderRequest): Promise<Reminder | null> {
    const reminders = this.remindersSubject.value;
    const index = reminders.findIndex((r) => r.id === id);

    if (index === -1) return null;

    const updatedReminder: Reminder = {
      ...reminders[index],
      ...request,
      updatedAt: new Date(),
    };

    const updatedReminders = [...reminders];
    updatedReminders[index] = updatedReminder;

    await setData('reminders', updatedReminders);
    this.remindersSubject.next(updatedReminders);

    // Reschedule reminder
    this.clearReminderTimer(id);
    if (updatedReminder.isEnabled) {
      this.scheduleReminder(updatedReminder);
    }

    return updatedReminder;
  }

  async deleteReminder(id: string): Promise<boolean> {
    const reminders = this.remindersSubject.value;
    const updatedReminders = reminders.filter((r) => r.id !== id);

    await setData('reminders', updatedReminders);
    this.remindersSubject.next(updatedReminders);

    this.clearReminderTimer(id);
    return true;
  }

  async toggleReminder(id: string): Promise<boolean> {
    const reminder = this.remindersSubject.value.find((r) => r.id === id);
    if (!reminder) return false;

    await this.updateReminder(id, { isEnabled: !reminder.isEnabled });
    return true;
  }

  // Daily Intention CRUD operations
  async createOrUpdateDailyIntention(
    request: CreateDailyIntentionRequest | UpdateDailyIntentionRequest
  ): Promise<DailyIntention> {
    const existing = this.dailyIntentionSubject.value;

    const intention: DailyIntention = existing
      ? {
          ...existing,
          ...request,
          updatedAt: new Date(),
        }
      : {
          id: this.generateId(),
          isEnabled: true,
          intervalHours: 4,
          startTime: '08:00',
          endTime: '22:00',
          useRandomMessages: true,
          ...request,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

    await setData('dailyIntention', intention);
    this.dailyIntentionSubject.next(intention);

    // Reschedule intention reminders
    this.clearIntentionTimers();
    if (intention.isEnabled) {
      this.scheduleIntentionReminders(intention);
    }

    return intention;
  }

  async toggleDailyIntention(): Promise<boolean> {
    const intention = this.dailyIntentionSubject.value;
    if (!intention) return false;

    await this.createOrUpdateDailyIntention({ isEnabled: !intention.isEnabled });
    return true;
  }

  // Private helper methods
  private async loadReminders(): Promise<void> {
    const reminders = (await getData<Reminder[]>('reminders')) || [];
    this.remindersSubject.next(reminders);
  }

  private async loadDailyIntention(): Promise<void> {
    const intention = await getData<DailyIntention>('dailyIntention');
    this.dailyIntentionSubject.next(intention);
  }

  private async scheduleAllReminders(): Promise<void> {
    const reminders = this.remindersSubject.value.filter((r) => r.isEnabled);
    reminders.forEach((reminder) => this.scheduleReminder(reminder));

    const intention = this.dailyIntentionSubject.value;
    if (intention?.isEnabled) {
      this.scheduleIntentionReminders(intention);
    }
  }

  private scheduleReminder(reminder: Reminder): void {
    const now = new Date();
    const currentDay = this.getCurrentWeekDay();

    // Check if reminder should run today
    if (!reminder.days.includes(currentDay)) {
      // Schedule for next valid day
      this.scheduleReminderForNextValidDay(reminder);
      return;
    }

    const [hours, minutes] = reminder.time.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for next valid day
    if (scheduledTime <= now) {
      this.scheduleReminderForNextValidDay(reminder);
      return;
    }

    const delay = scheduledTime.getTime() - now.getTime();

    this.zone.runOutsideAngular(() => {
      const timerId = setTimeout(() => {
        this.zone.run(() => {
          this.showNotification(reminder.title, reminder.message);
          // Reschedule for next occurrence
          this.scheduleReminderForNextValidDay(reminder);
        });
      }, delay);

      this.activeTimers.set(`reminder_${reminder.id}`, timerId);
    });
  }

  private scheduleReminderForNextValidDay(reminder: Reminder): void {
    const now = new Date();
    const currentDay = this.getCurrentWeekDay();
    const currentDayIndex = this.getWeekDayIndex(currentDay);

    // Find next valid day
    let nextValidDay: WeekDay | null = null;
    let daysToAdd = 1;

    for (let i = 1; i <= 7; i++) {
      const checkDayIndex = (currentDayIndex + i) % 7;
      const checkDay = this.getWeekDayByIndex(checkDayIndex);

      if (reminder.days.includes(checkDay)) {
        nextValidDay = checkDay;
        daysToAdd = i;
        break;
      }
    }

    if (!nextValidDay) return;

    const [hours, minutes] = reminder.time.split(':').map(Number);
    const nextScheduledTime = new Date(now);
    nextScheduledTime.setDate(now.getDate() + daysToAdd);
    nextScheduledTime.setHours(hours, minutes, 0, 0);

    const delay = nextScheduledTime.getTime() - now.getTime();

    this.zone.runOutsideAngular(() => {
      const timerId = setTimeout(() => {
        this.zone.run(() => {
          this.showNotification(reminder.title, reminder.message);
          // Reschedule for next occurrence
          this.scheduleReminderForNextValidDay(reminder);
        });
      }, delay);

      this.activeTimers.set(`reminder_${reminder.id}`, timerId);
    });
  }

  private scheduleIntentionReminders(intention: DailyIntention): void {
    const intervalMs = intention.intervalHours * 60 * 60 * 1000;

    const scheduleNext = () => {
      this.zone.runOutsideAngular(() => {
        const timerId = setTimeout(() => {
          this.zone.run(() => {
            const message = intention.customMessage || getRandomIntentionMessage();
            this.showNotification('Намерение дня', message);

            // Schedule next reminder if still enabled
            const currentIntention = this.dailyIntentionSubject.value;
            if (currentIntention?.isEnabled) {
              scheduleNext();
            }
          });
        }, intervalMs);

        this.activeTimers.set('intention_main', timerId);
      });
    };

    scheduleNext();
  }

  private clearReminderTimer(reminderId: string): void {
    const timerId = this.activeTimers.get(`reminder_${reminderId}`);
    if (timerId) {
      clearTimeout(timerId);
      this.activeTimers.delete(`reminder_${reminderId}`);
    }
  }

  private clearIntentionTimers(): void {
    const timerId = this.activeTimers.get('intention_main');
    if (timerId) {
      clearTimeout(timerId);
      this.activeTimers.delete('intention_main');
    }
  }

  private showNotification(title: string, message: string): void {
    // Try to use browser notifications if available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/assets/icons/icon-192x192.png',
      });
    } else {
      // Fallback to alert
      alert(`${title}\n\n${message}`);
    }
  }

  private getCurrentWeekDay(): WeekDay {
    const dayIndex = new Date().getDay();
    // Convert Sunday (0) to index 6, Monday (1) to index 0, etc.
    const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    return this.getWeekDayByIndex(adjustedIndex);
  }

  private getWeekDayIndex(day: WeekDay): number {
    const days: WeekDay[] = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    return days.indexOf(day);
  }

  private getWeekDayByIndex(index: number): WeekDay {
    const days: WeekDay[] = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];
    return days[index];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Legacy mood reminder support
  async setDailyMoodReminder(timeHHmm: string): Promise<void> {
    await setSetting('moodReminderTime', timeHHmm);
    this.scheduleMoodReminder(timeHHmm);
  }

  private scheduleMoodReminder(timeHHmm: string): void {
    const timerId = this.activeTimers.get('mood_reminder');
    if (timerId) {
      clearTimeout(timerId);
    }

    const [hh, mm] = timeHHmm.split(':').map((n) => parseInt(n, 10));
    const now = new Date();
    const next = new Date();
    next.setHours(hh, mm, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);

    const delay = next.getTime() - now.getTime();

    this.zone.runOutsideAngular(() => {
      const newTimerId = setTimeout(() => {
        this.zone.run(() => {
          this.showNotification('Настроение', 'Пора оценить день и записать настроение.');
        });
        // Reschedule for next day
        this.scheduleMoodReminder(timeHHmm);
      }, delay);

      this.activeTimers.set('mood_reminder', newTimerId);
    });
  }

  // Notification permission management
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  getNotificationPermissionStatus(): string {
    if (!('Notification' in window)) {
      return 'not-supported';
    }
    return Notification.permission;
  }
}
