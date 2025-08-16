// Journal service wrapping Dexie operations

import { Injectable } from '@angular/core';
import {
  addJournalEntry,
  deleteJournalEntry,
  listJournalEntriesByDate,
  addPracticeRun,
  listPracticeRunsByDate,
  PracticeRun,
  JournalEntry
} from './db.service';

@Injectable({ providedIn: 'root' })
export class JournalService {
  async savePracticeRun(run: Omit<PracticeRun, 'id'> & { id?: string }): Promise<string> {
    return addPracticeRun(run);
  }

  async saveInsight(text: string, practiceRunId?: string, stepId?: string): Promise<string> {
    const entry: Omit<JournalEntry, 'id' | 'createdAt' | 'dateKey'> = {
      type: 'insight',
      text,
      practiceRunId,
      stepId
    } as any;
    return addJournalEntry(entry);
  }

  async saveNote(text: string): Promise<string> {
    const entry: Omit<JournalEntry, 'id' | 'createdAt' | 'dateKey'> = {
      type: 'note',
      text
    } as any;
    return addJournalEntry(entry);
  }

  async saveMood(moodRating: number): Promise<string> {
    const entry: Omit<JournalEntry, 'id' | 'createdAt' | 'dateKey'> = {
      type: 'mood',
      moodRating
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
