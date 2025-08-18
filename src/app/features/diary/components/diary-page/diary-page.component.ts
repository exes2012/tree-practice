import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JournalService } from '@app/core/services/journal.service';
import { NotesService, Note } from '@app/core/services/notes.service';
import { BottomNavigationComponent } from '../../../../shared/components/bottom-navigation/bottom-navigation.component';

function toDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${day}`;
}

@Component({
  selector: 'app-diary-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavigationComponent],
  templateUrl: './diary-page.component.html',
  styleUrl: './diary-page.component.scss',
})
export class DiaryPageComponent implements OnInit {
  date = new Date();
  dateKey = toDateKey(this.date);
  isToday = true;
  runs: any[] = [];
  entries: any[] = [];
  notes: Note[] = [];
  events: any[] = [];
  groupedEvents: { label: string; items: any[] }[] = [];
  newNote = '';
  mood: number | null = null;

  // Общая продолжительность практик за день
  totalDuration = 0;

  // Mood options inspired by Daylio app
  moodOptions = [
    { value: 1, emoji: '😢', color: '#FF6B6B', label: 'Ужасно' },
    { value: 2, emoji: '😔', color: '#FFA726', label: 'Плохо' },
    { value: 3, emoji: '😐', color: '#FFCC02', label: 'Нормально' },
    { value: 4, emoji: '😊', color: '#66BB6A', label: 'Хорошо' },
    { value: 5, emoji: '😍', color: '#42A5F5', label: 'Отлично' },
  ];

  // Mood icon values (4 distinct moods)
  moodIconOptions: number[] = [2, 5, 7, 9];

  constructor(
    private journal: JournalService,
    private notesService: NotesService,
    private router: Router
  ) {}

  // Navigate to home page (used in sticky header like Notes section)
  goToHome() {
    this.router.navigate(['/home']);
  }

  async ngOnInit() {
    await this.loadDay();
  }

  async loadDay() {
    this.dateKey = toDateKey(this.date);
    this.isToday = this.dateKey === toDateKey(new Date());
    this.runs = await this.journal.listRunsByDate(this.dateKey);
    this.entries = await this.journal.listByDate(this.dateKey);
    this.notes = await this.notesService.getNotesByDate(this.dateKey);
    const moodEntry = this.entries.find((e) => e.type === 'mood');
    if (moodEntry?.moodRating) this.mood = moodEntry.moodRating;

    // Вычисляем общую продолжительность практик за день
    this.totalDuration = (this.runs || [])
      .filter((r) => r.duration && r.duration > 0)
      .reduce((total, r) => total + (r.duration || 0), 0);

    // Build unified timeline events: mood, runs, notes
    const moodEvents = moodEntry
      ? [
          {
            type: 'mood',
            icon: this.getRatingIconFromValue(moodEntry.moodRating),
            title: 'Настроение',
            time: new Date(moodEntry.createdAt),
            data: { value: moodEntry.moodRating },
          },
        ]
      : [];

    const runEvents = (this.runs || []).map((r) => {
      return {
        type: 'run',
        icon: r.rating ? this.getRatingIconFromValue(r.rating) : 'sentiment_neutral',
        title: r.title,
        time: new Date(r.completedAt),
        data: r,
      };
    });

    const noteEvents = (this.notes || []).map((n) => ({
      type: 'note',
      icon: 'edit_note',
      title: n.title || 'Без заголовка',
      time: new Date(n.updatedAt || n.dateKey),
      data: n,
    }));

    this.events = [...moodEvents, ...runEvents, ...noteEvents].sort(
      (a, b) => b.time.getTime() - a.time.getTime()
    );

    // Group into time periods (ordered from latest to earliest)
    const groups = [
      { key: 'night', label: 'Ночь', start: 0, end: 5 }, // 00:00 - 04:59
      { key: 'evening', label: 'Вечер', start: 18, end: 24 }, // 18:00 - 23:59
      { key: 'day', label: 'День', start: 11, end: 18 }, // 11:00 - 17:59
      { key: 'morning', label: 'Утро', start: 5, end: 11 }, // 05:00 - 10:59
    ];

    const buckets: Record<string, any[]> = { morning: [], day: [], evening: [], night: [] };
    for (const ev of this.events) {
      const h = ev.time.getHours();
      const group = groups.find((g) => h >= g.start && h < g.end) || groups[0]; // night as default
      buckets[group.key].push(ev);
    }
    this.groupedEvents = groups
      .map((g) => ({ label: g.label, items: buckets[g.key] }))
      .filter((g) => g.items.length > 0);
  }

  async prevDay() {
    this.date.setDate(this.date.getDate() - 1);
    await this.loadDay();
  }

  async nextDay() {
    this.date.setDate(this.date.getDate() + 1);
    await this.loadDay();
  }

  async addNote() {
    const text = this.newNote?.trim();
    if (!text) return;
    await this.journal.saveNote(text);
    this.newNote = '';
    await this.loadDay();
  }

  async setMood(moodValue: number) {
    // Only allow setting mood for today
    if (!this.isToday) return;
    this.mood = moodValue;
    await this.journal.saveMood(this.mood);
    await this.loadDay();
  }

  getMoodLabel(moodValue: number): string {
    const moodOption = this.moodOptions.find((option) => option.value === moodValue);
    return moodOption ? moodOption.label : '';
  }

  // Map practice rating (1-10) to material icon name like in practice shell
  getRatingIconFromValue(rating: number): string {
    const icons = [
      'sentiment_very_dissatisfied', // 1 - очень плохо
      'sentiment_dissatisfied', // 2 - плохо
      'sentiment_dissatisfied', // 3 - плохо
      'sentiment_neutral', // 4 - нейтрально
      'sentiment_neutral', // 5 - нейтрально
      'sentiment_satisfied', // 6 - хорошо
      'sentiment_satisfied', // 7 - хорошо
      'sentiment_very_satisfied', // 8 - очень хорошо
      'sentiment_very_satisfied', // 9 - очень хорошо
      'sentiment_very_satisfied', // 10 - отлично (убираем mood, оставляем очень довольный смайл)
    ];
    const idx = Math.max(1, Math.min(10, Math.floor(rating))) - 1;
    return icons[idx] || 'sentiment_neutral';
  }

  // Color class by mood value (distinct, no duplicates visually)
  getMoodColorClass(v: number): string {
    if (v <= 2) return 'text-red-500';
    if (v <= 4) return 'text-orange-500';
    if (v <= 6) return 'text-amber-500';
    if (v <= 8) return 'text-lime-600';
    return 'text-green-600';
  }

  formatDate(dateKey: string): string {
    const date = new Date(dateKey);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateKey === toDateKey(today)) {
      return 'Сегодня';
    } else if (dateKey === toDateKey(yesterday)) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
      });
    }
  }

  formatDay(dateKey: string): string {
    const date = new Date(dateKey);
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
    });
  }

  async deleteEntry(id: string) {
    await this.journal.deleteEntry(id);
    await this.loadDay();
  }

  openNote(noteId: string) {
    this.router.navigate(['/notes', noteId]);
  }

  createNote() {
    this.router.navigate(['/notes', 'new']);
  }

  async toggleFavoriteNote(noteId: string) {
    const note = await this.notesService.getNote(noteId);
    if (note) {
      await this.notesService.updateNote(noteId, { isFavorite: !note.isFavorite });
      await this.loadDay();
    }
  }

  async deleteNoteById(noteId: string) {
    await this.notesService.deleteNote(noteId);
    await this.loadDay();
  }

  openPracticeRun(run: any) {
    if (run?.route) {
      this.router.navigate([run.route]);
    }
  }

  getPreviewText(content: string): string {
    if (!content) return '';
    const cleanText = content.replace(/#\w+/g, '').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    return cleanText.length > 100 ? cleanText.substring(0, 97) + '...' : cleanText;
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes} мин ${remainingSeconds} сек`;
    } else {
      return `${seconds} сек`;
    }
  }
}
