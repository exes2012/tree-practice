import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { db, dateToLocalDateKey } from './db.service';

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

export type NoteSortBy = 'updatedAt' | 'createdAt' | 'title';
export type SortOrder = 'asc' | 'desc';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private notesSubject = new BehaviorSubject<Note[]>([]);
  public notes$ = this.notesSubject.asObservable();

  constructor() {
    this.loadNotes();
  }

  async loadNotes(): Promise<void> {
    try {
      const notes = await db.notes.orderBy('updatedAt').reverse().toArray();
      this.notesSubject.next(notes);
    } catch (error) {
      console.error('Error loading notes:', error);
      this.notesSubject.next([]);
    }
  }

  async createNote(title: string = '', content: string = ''): Promise<string> {
    const now = new Date();
    const id = globalThis.crypto?.randomUUID?.() ?? `note-${Date.now()}-${Math.random()}`;

    const note: Note = {
      id,
      title: title || this.generateTitleFromContent(content),
      content,
      tags: this.extractTagsFromContent(content),
      isFavorite: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      dateKey: dateToLocalDateKey(now),
    };

    await db.notes.add(note);
    await this.loadNotes();
    return id;
  }

  async updateNote(
    id: string,
    updates: Partial<Pick<Note, 'title' | 'content' | 'tags' | 'isFavorite'>>
  ): Promise<void> {
    const now = new Date();
    const updateData: Partial<Note> = {
      ...updates,
      updatedAt: now.toISOString(),
      dateKey: dateToLocalDateKey(now),
    };

    // Auto-update title if content changed and title is auto-generated
    if (updates.content !== undefined) {
      const existingNote = await db.notes.get(id);
      if (
        existingNote &&
        (!updates.title || updates.title === this.generateTitleFromContent(existingNote.content))
      ) {
        updateData.title = this.generateTitleFromContent(updates.content);
      }
      updateData.tags = this.extractTagsFromContent(updates.content);
    }

    await db.notes.update(id, updateData);
    await this.loadNotes();
  }

  async deleteNote(id: string): Promise<void> {
    await db.notes.delete(id);
    await this.loadNotes();
  }

  async getNote(id: string): Promise<Note | undefined> {
    return await db.notes.get(id);
  }

  async searchNotes(query: string): Promise<Note[]> {
    if (!query.trim()) {
      return this.notesSubject.value;
    }

    const lowerQuery = query.toLowerCase();
    return this.notesSubject.value.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery) ||
        note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async getNotesByTag(tag: string): Promise<Note[]> {
    return await db.notes.where('tags').equals(tag).toArray();
  }

  async getNotesByDate(dateKey: string): Promise<Note[]> {
    return await db.notes.where('dateKey').equals(dateKey).toArray();
  }

  async getFavoriteNotes(): Promise<Note[]> {
    return await db.notes.where('isFavorite').equals(1).toArray();
  }

  async getAllTags(): Promise<string[]> {
    const notes = this.notesSubject.value;
    const tagSet = new Set<string>();
    notes.forEach((note) => note.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }

  sortNotes(notes: Note[], sortBy: NoteSortBy, order: SortOrder = 'desc'): Note[] {
    return [...notes].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'title') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  private generateTitleFromContent(content: string): string {
    if (!content.trim()) {
      return 'Новая заметка';
    }

    // Get first non-empty line, limit to 50 characters
    const firstLine = content.split('\n').find((line) => line.trim()) || '';
    return firstLine.length > 50
      ? firstLine.substring(0, 47) + '...'
      : firstLine || 'Новая заметка';
  }

  private extractTagsFromContent(content: string): string[] {
    // Extract hashtags from content
    const tagRegex = /#([а-яё\w]+)/gi;
    const matches = content.match(tagRegex);
    if (!matches) return [];

    return [...new Set(matches.map((match) => match.substring(1).toLowerCase()))];
  }

  async exportNotes(): Promise<string> {
    const notes = this.notesSubject.value;
    return JSON.stringify(notes, null, 2);
  }

  async importNotes(notesJson: string): Promise<void> {
    try {
      const importedNotes: Note[] = JSON.parse(notesJson);

      for (const note of importedNotes) {
        // Generate new IDs to avoid conflicts
        const newId = globalThis.crypto?.randomUUID?.() ?? `note-${Date.now()}-${Math.random()}`;
        await db.notes.add({ ...note, id: newId });
      }

      await this.loadNotes();
    } catch (error) {
      console.error('Error importing notes:', error);
      throw new Error('Ошибка импорта заметок. Проверьте формат файла.');
    }
  }
}
