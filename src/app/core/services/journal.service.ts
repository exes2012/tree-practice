// Journal service wrapping Dexie operations

import { Injectable } from '@angular/core';
import {
  addJournalEntry,
  deleteJournalEntry,
  listJournalEntriesByDate,
  addPracticeRun,
  listPracticeRunsByDate,
  PracticeRun,
  JournalEntry,
} from './db.service';

@Injectable({ providedIn: 'root' })
export class JournalService {
  // Храним последние сохраненные практики, чтобы избежать дублирования
  private recentPracticeRuns = new Map<string, number>(); // practiceId -> timestamp
  async savePracticeRun(run: Omit<PracticeRun, 'id'> & { id?: string }): Promise<string> {
    // Создаем уникальный ключ для предотвращения дублирования
    const practiceKey = `${run.practiceId}-${run.dateKey || new Date().toISOString().split('T')[0]}`;
    const now = Date.now();

    // Проверяем, не сохраняли ли мы эту практику за последние 2 секунды
    const lastSaved = this.recentPracticeRuns.get(practiceKey);
    if (lastSaved && now - lastSaved < 2000) {
      console.log('JournalService: Skipping duplicate practice run for key:', practiceKey);
      // Возвращаем фиктивный ID или можно вернуть ID последней записи
      return `duplicate-${practiceKey}-${now}`;
    }

    // Сохраняем timestamp и вызываем оригинальный метод
    this.recentPracticeRuns.set(practiceKey, now);

    // Очищаем старые записи (старше 10 секунд)
    for (const [key, timestamp] of this.recentPracticeRuns.entries()) {
      if (now - timestamp > 10000) {
        this.recentPracticeRuns.delete(key);
      }
    }

    return addPracticeRun(run);
  }

  async saveInsight(text: string, practiceRunId?: string, stepId?: string): Promise<string> {
    const entry: Omit<JournalEntry, 'id' | 'createdAt' | 'dateKey'> = {
      type: 'insight',
      text,
      practiceRunId,
      stepId,
    } as any;
    return addJournalEntry(entry);
  }

  async saveNote(text: string): Promise<string> {
    const entry: Omit<JournalEntry, 'id' | 'createdAt' | 'dateKey'> = {
      type: 'note',
      text,
    } as any;
    return addJournalEntry(entry);
  }

  async saveMood(moodRating: number): Promise<string> {
    const entry: Omit<JournalEntry, 'id' | 'createdAt' | 'dateKey'> = {
      type: 'mood',
      moodRating,
    } as any;
    return addJournalEntry(entry);
  }

  listByDate(dateKey: string) {
    return listJournalEntriesByDate(dateKey);
  }

  listRunsByDate(dateKey: string) {
    return listPracticeRunsByDate(dateKey);
  }

  deleteEntry(id: string) {
    return deleteJournalEntry(id);
  }
}
