// Simple in-app reminder service (v1). PWA notifications can be added later.

import { Injectable, NgZone } from '@angular/core';
import { setSetting, getSetting } from './db.service';

@Injectable({ providedIn: 'root' })
export class ReminderService {
  private timerId: any;

  constructor(private zone: NgZone) {}

  async setDailyMoodReminder(timeHHmm: string): Promise<void> {
    await setSetting('moodReminderTime', timeHHmm);
    this.scheduleNext(timeHHmm);
  }

  async init(): Promise<void> {
    const time = await getSetting('moodReminderTime');
    if (time) this.scheduleNext(time);
  }

  private scheduleNext(timeHHmm: string): void {
    if (this.timerId) clearTimeout(this.timerId);

    const [hh, mm] = timeHHmm.split(':').map(n => parseInt(n, 10));
    const now = new Date();
    const next = new Date();
    next.setHours(hh, mm, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);

    const delay = next.getTime() - now.getTime();

    this.zone.runOutsideAngular(() => {
      this.timerId = setTimeout(() => {
        this.zone.run(() => {
          // Simple in-app notification
          alert('Пора оценить день и записать настроение.');
        });
        // Reschedule for next day
        this.scheduleNext(timeHHmm);
      }, delay);
    });
  }
}

