import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalService } from '@app/core/services/journal.service';

@Component({
  selector: 'app-journal-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journal-page.component.html',
})
export class JournalPageComponent {
  notes: any[] = [];
  newNote = '';

  constructor(private journal: JournalService) {
    this.loadNotes();
  }

  async loadNotes() {
    const today = new Date();
    const y = today.getFullYear();
    const m = `${today.getMonth() + 1}`.padStart(2, '0');
    const d = `${today.getDate()}`.padStart(2, '0');
    const key = `${y}-${m}-${d}`;
    // На MVP: показываем записи за сегодня и вчера
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const ykey = `${yesterday.getFullYear()}-${`${yesterday.getMonth() + 1}`.padStart(2, '0')}-${`${yesterday.getDate()}`.padStart(2, '0')}`;
    const a = await this.journal.listByDate(key);
    const b = await this.journal.listByDate(ykey);
    this.notes = [...a, ...b].filter((e) => e.type === 'note');
  }

  async addNote() {
    const text = this.newNote.trim();
    if (!text) return;
    await this.journal.saveNote(text);
    this.newNote = '';
    await this.loadNotes();
  }

  async delete(id: string) {
    await this.journal.deleteEntry(id);
    await this.loadNotes();
  }
}
