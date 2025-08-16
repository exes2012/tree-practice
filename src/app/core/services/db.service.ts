// IndexedDB via Dexie for local storage of practices, journal, and settings
// Minimal, focused on current needs

import Dexie, { Table } from 'dexie';

export type JournalEntryType = 'insight' | 'note' | 'mood';

export interface PracticeRun {
  id: string; // uuid
  practiceId: string;
  title: string;
  route: string;
  startedAt?: string; // ISO
  completedAt: string; // ISO
  dateKey: string; // YYYY-MM-DD (local)
  rating?: number;
}

export interface JournalEntry {
  id: string; // uuid
  type: JournalEntryType;
  text?: string;
  moodRating?: number;
  practiceRunId?: string;
  stepId?: string;
  createdAt: string; // ISO
  dateKey: string; // YYYY-MM-DD (local)
}

export interface Setting {
  key: string;
  value: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  dateKey: string;
}

export class AppDB extends Dexie {
  practice_runs!: Table<PracticeRun, string>;
  journal_entries!: Table<JournalEntry, string>;
  settings!: Table<Setting, string>;
  notes!: Table<Note, string>;

  constructor() {
    super('kabbalah_practice_db');
    this.version(1).stores({
      practice_runs: 'id, practiceId, completedAt',
      journal_entries: 'id, dateKey, type, practiceRunId',
      settings: 'key'
    });
    this.version(2).stores({
      practice_runs: 'id, practiceId, dateKey, completedAt',
      journal_entries: 'id, dateKey, type, practiceRunId',
      settings: 'key'
    });
    this.version(3).stores({
      practice_runs: 'id, practiceId, dateKey, completedAt',
      journal_entries: 'id, dateKey, type, practiceRunId',
      settings: 'key',
      notes: 'id, dateKey, title, updatedAt, isFavorite, *tags'
    });
  }
}

export const db = new AppDB();

// Helpers
export function dateToLocalDateKey(d: Date = new Date()): string {
  // Creates YYYY-MM-DD in local timezone
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function addPracticeRun(run: Omit<PracticeRun, 'id' | 'dateKey'> & { id?: string; dateKey?: string }): Promise<string> {
  const id = run.id ?? (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
  const completedAt = run.completedAt ?? new Date().toISOString();
  const localKey = run.dateKey ?? dateToLocalDateKey(new Date(completedAt));
  await db.practice_runs.add({ ...run, id, completedAt, dateKey: localKey });
  return id;
}

export async function addJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'dateKey'> & { id?: string; createdAt?: string; dateKey?: string }): Promise<string> {
  const now = new Date();
  const id = entry.id ?? (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`);
  const createdAt = entry.createdAt ?? now.toISOString();
  const dateKey = entry.dateKey ?? dateToLocalDateKey(now);
  await db.journal_entries.add({ ...entry, id, createdAt, dateKey });
  return id;
}

export async function listJournalEntriesByDate(dateKey: string): Promise<JournalEntry[]> {
  return db.journal_entries.where('dateKey').equals(dateKey).reverse().sortBy('createdAt');
}

export async function deleteJournalEntry(id: string): Promise<void> {
  await db.journal_entries.delete(id);
}

export async function listPracticeRunsByDate(dateKey: string) {
  return db.practice_runs.where('dateKey').equals(dateKey).reverse().sortBy('completedAt');
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db.settings.put({ key, value });
}

export async function getSetting(key: string): Promise<string | undefined> {
  const s = await db.settings.get(key);
  return s?.value;
}

