import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { NotesService, Note, NoteSortBy, SortOrder } from '../../../../core/services/notes.service';
import { NoteCardComponent } from '../note-card/note-card.component';
import { BottomNavigationComponent } from '../../../../shared/components/bottom-navigation/bottom-navigation.component';

@Component({
  selector: 'app-notes-page',
  imports: [CommonModule, FormsModule, NoteCardComponent, BottomNavigationComponent],
  templateUrl: './notes-page.component.html',
  
})
export class NotesPageComponent implements OnInit, OnDestroy {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  searchQuery = '';
  selectedTag = '';
  sortBy: NoteSortBy = 'updatedAt';
  sortOrder: SortOrder = 'desc';
  showFavoritesOnly = false;
  isLoading = true;
  allTags: string[] = [];

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private notesService: NotesService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to notes changes
    this.notesService.notes$.pipe(takeUntil(this.destroy$)).subscribe((notes) => {
      this.notes = notes;
      this.isLoading = false;
      this.updateFilteredNotes();
      this.loadTags();
    });

    // Setup search debouncing
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        this.searchQuery = query;
        this.updateFilteredNotes();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchSubject.next(target.value);
  }

  async createNote() {
    const noteId = await this.notesService.createNote();
    this.router.navigate(['/notes', noteId]);
  }

  async deleteNote(noteId: string) {
    if (confirm('Удалить эту заметку?')) {
      await this.notesService.deleteNote(noteId);
    }
  }

  async toggleFavorite(note: Note) {
    await this.notesService.updateNote(note.id, { isFavorite: !note.isFavorite });
  }

  openNote(noteId: string) {
    this.router.navigate(['/notes', noteId]);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  filterByTag(tag: string) {
    this.selectedTag = this.selectedTag === tag ? '' : tag;
    this.updateFilteredNotes();
  }

  toggleFavoritesFilter() {
    this.showFavoritesOnly = !this.showFavoritesOnly;
    this.updateFilteredNotes();
  }

  changeSorting(sortBy: NoteSortBy) {
    if (this.sortBy === sortBy) {
      this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    } else {
      this.sortBy = sortBy;
      this.sortOrder = 'desc';
    }
    this.updateFilteredNotes();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedTag = '';
    this.showFavoritesOnly = false;
    this.updateFilteredNotes();
  }

  private async updateFilteredNotes() {
    let filtered = [...this.notes];

    // Apply search filter
    if (this.searchQuery.trim()) {
      filtered = await this.notesService.searchNotes(this.searchQuery);
    }

    // Apply tag filter
    if (this.selectedTag) {
      filtered = filtered.filter((note) => note.tags.includes(this.selectedTag));
    }

    // Apply favorites filter
    if (this.showFavoritesOnly) {
      filtered = filtered.filter((note) => note.isFavorite);
    }

    // Apply sorting
    this.filteredNotes = this.notesService.sortNotes(filtered, this.sortBy, this.sortOrder);
  }

  private async loadTags() {
    this.allTags = await this.notesService.getAllTags();
  }

  getActiveFiltersCount(): number {
    let count = 0;
    if (this.searchQuery.trim()) count++;
    if (this.selectedTag) count++;
    if (this.showFavoritesOnly) count++;
    return count;
  }

  trackByNoteId(index: number, note: Note): string {
    return note.id;
  }
}
