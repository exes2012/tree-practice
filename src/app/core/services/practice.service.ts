import { Injectable } from '@angular/core';

export interface Practice {
  name: string;
  route: string;
}

export interface PracticeStats {
  totalPractices: number;
  streak: number;
  lastPracticeDate: string; // YYYY-MM-DD
}

@Injectable({
  providedIn: 'root'
})
export class PracticeService {
  private readonly LAST_PRACTICE_KEY = 'lastPractice';
  private readonly STATS_KEY = 'practiceStats';

  constructor() {
    this.checkStreakOnLoad();
  }

  private checkStreakOnLoad(): void {
    const stats = this.getPracticeStats();
    if (!stats.lastPracticeDate) {
      return;
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (stats.lastPracticeDate !== todayStr && stats.lastPracticeDate !== yesterdayStr) {
      stats.streak = 0;
      localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    }
  }

  saveLastPractice(practice: Practice): void {
    localStorage.setItem(this.LAST_PRACTICE_KEY, JSON.stringify(practice));
  }

  getLastPractice(): Practice | null {
    const practiceJson = localStorage.getItem(this.LAST_PRACTICE_KEY);
    return practiceJson ? JSON.parse(practiceJson) : null;
  }

  getPracticeStats(): PracticeStats {
    const statsJson = localStorage.getItem(this.STATS_KEY);
    if (statsJson) {
      return JSON.parse(statsJson);
    }
    return { totalPractices: 0, streak: 0, lastPracticeDate: '' };
  }

  recordPracticeCompletion(): void {
    const stats = this.getPracticeStats();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    stats.totalPractices++;

    if (stats.lastPracticeDate) {
      const lastDate = new Date(stats.lastPracticeDate);
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (stats.lastPracticeDate === todayStr) {
        // Practiced today, do nothing to the streak
      } else if (stats.lastPracticeDate === yesterdayStr) {
        stats.streak++;
      } else {
        stats.streak = 1;
      }
    } else {
      stats.streak = 1;
    }

    stats.lastPracticeDate = todayStr;
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  }
}
