import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { NotesService, Note } from '../../../../core/services/notes.service';

@Component({
  selector: 'app-note-editor',
  imports: [CommonModule, FormsModule],
  templateUrl: './note-editor.component.html',
  styleUrls: ['./note-editor.component.scss'],
})
export class NoteEditorComponent implements OnInit, OnDestroy {
  note: Note | null = null;
  title = '';
  content = '';
  isLoading = true;
  isSaving = false;
  hasUnsavedChanges = false;
  isNewNote = false;
  showFormatting = false;
  showMobileMenu = false;

  private destroy$ = new Subject<void>();
  private saveSubject = new Subject<void>();
  private initialLoad = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notesService: NotesService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    const noteId = this.route.snapshot.paramMap.get('id');

    if (noteId === 'new' || !noteId) {
      this.createNewNote();
    } else {
      this.loadNote(noteId);
    }

    // Setup auto-save
    this.saveSubject
      .pipe(
        debounceTime(1000), // Wait 1 second after user stops typing
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        if (this.hasUnsavedChanges && !this.initialLoad) {
          this.saveNote();
        }
      });
  }

  ngOnDestroy() {
    if (this.hasUnsavedChanges) {
      this.saveNote();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.hasUnsavedChanges) {
      $event.returnValue =
        'У вас есть несохраненные изменения. Вы уверены, что хотите покинуть страницу?';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.showMobileMenu && !this.elementRef.nativeElement.contains(event.target)) {
      this.showMobileMenu = false;
    }
  }

  async createNewNote() {
    this.isNewNote = true;
    this.title = '';
    this.content = '';
    this.isLoading = false;
    this.focusEditor();
  }

  async loadNote(noteId: string) {
    try {
      const note = await this.notesService.getNote(noteId);
      if (note) {
        this.note = note;
        this.title = note.title;
        this.content = note.content;
        this.hasUnsavedChanges = false;
      } else {
        this.router.navigate(['/notes']);
        return;
      }
    } catch (error) {
      console.error('Error loading note:', error);
      this.router.navigate(['/notes']);
      return;
    }

    this.isLoading = false;
    this.initialLoad = false;
    this.focusEditor();
  }

  onTitleChange() {
    this.hasUnsavedChanges = true;
    this.saveSubject.next();
  }

  onContentChange() {
    this.hasUnsavedChanges = true;
    this.saveSubject.next();
  }

  async saveNote() {
    if (this.isSaving) return;

    this.isSaving = true;

    try {
      if (this.isNewNote) {
        const noteId = await this.notesService.createNote(this.title, this.content);
        this.isNewNote = false;
        // Update URL without navigation to avoid reloading
        window.history.replaceState({}, '', `/notes/${noteId}`);
        const updatedNote = await this.notesService.getNote(noteId);
        if (updatedNote) this.note = updatedNote;
      } else if (this.note) {
        await this.notesService.updateNote(this.note.id, {
          title: this.title,
          content: this.content,
        });
        const updatedNote = await this.notesService.getNote(this.note.id);
        if (updatedNote) this.note = updatedNote;
      }

      this.hasUnsavedChanges = false;
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      this.isSaving = false;
    }
  }

  async deleteNote() {
    if (!this.note) return;

    if (confirm('Вы уверены, что хотите удалить эту заметку?')) {
      try {
        await this.notesService.deleteNote(this.note.id);
        this.router.navigate(['/notes']);
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  }

  async toggleFavorite() {
    if (!this.note) return;

    try {
      await this.notesService.updateNote(this.note.id, {
        isFavorite: !this.note.isFavorite,
      });
      const updatedNote = await this.notesService.getNote(this.note.id);
      if (updatedNote) this.note = updatedNote;
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  goBack() {
    if (this.hasUnsavedChanges) {
      this.saveNote().then(() => {
        this.router.navigate(['/notes']);
      });
    } else {
      this.router.navigate(['/notes']);
    }
  }

  insertList() {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = this.content.split('\n');
    let currentLine = 0;
    let charCount = 0;

    // Find which line the cursor is on
    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1; // +1 for \n
      if (charCount + lineLength > start) {
        currentLine = i;
        break;
      }
      charCount += lineLength;
    }

    // Check if current line is already a list item
    const line = lines[currentLine];
    const listPattern = /^(\s*)([-*+]|\d+\.)\s/;
    const match = line.match(listPattern);

    if (match) {
      // Remove list formatting from current line
      lines[currentLine] = line.replace(listPattern, match[1]);
    } else {
      // Add list formatting to current line
      const indent = line.match(/^\s*/)?.[0] || '';
      const restOfLine = line.substring(indent.length);
      lines[currentLine] = indent + '- ' + restOfLine;
    }

    this.content = lines.join('\n');
    this.onContentChange();

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
    });
  }

  insertNumberedList() {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = this.content.split('\n');
    let currentLine = 0;
    let charCount = 0;

    // Find which line the cursor is on
    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1; // +1 for \n
      if (charCount + lineLength > start) {
        currentLine = i;
        break;
      }
      charCount += lineLength;
    }

    // Check if current line is already a numbered list item
    const line = lines[currentLine];
    const numberedListPattern = /^(\s*)(\d+)\.\s/;
    const match = line.match(numberedListPattern);

    if (match) {
      // Remove numbered list formatting from current line
      lines[currentLine] = line.replace(numberedListPattern, match[1]);
    } else {
      // Add numbered list formatting to current line
      const indent = line.match(/^\s*/)?.[0] || '';
      const restOfLine = line.substring(indent.length);
      lines[currentLine] = indent + '1. ' + restOfLine;
    }

    this.content = lines.join('\n');
    this.onContentChange();

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
    });
  }

  insertHeading() {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lines = this.content.split('\n');
    let currentLine = 0;
    let charCount = 0;

    // Find which line the cursor is on
    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1;
      if (charCount + lineLength > start) {
        currentLine = i;
        break;
      }
      charCount += lineLength;
    }

    const line = lines[currentLine];
    const headingPattern = /^(#{1,6})\s/;
    const match = line.match(headingPattern);

    if (match) {
      const currentLevel = match[1].length;
      if (currentLevel < 6) {
        // Increase heading level
        lines[currentLine] = line.replace(headingPattern, '#'.repeat(currentLevel + 1) + ' ');
      } else {
        // Remove heading
        lines[currentLine] = line.replace(headingPattern, '');
      }
    } else {
      // Add heading
      lines[currentLine] = '# ' + line;
    }

    this.content = lines.join('\n');
    this.onContentChange();

    setTimeout(() => {
      textarea.focus();
    });
  }

  insertHashtag() {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = this.content.substring(start, end);

    let textToInsert = selectedText || 'тег';
    const newText = '#' + textToInsert;

    this.content = this.content.substring(0, start) + newText + this.content.substring(end);

    // Position cursor after the hashtag
    setTimeout(() => {
      if (selectedText) {
        const newPos = start + newText.length;
        textarea.setSelectionRange(newPos, newPos);
      } else {
        const newStart = start + 1;
        const newEnd = newStart + textToInsert.length;
        textarea.setSelectionRange(newStart, newEnd);
      }
      textarea.focus();
    });

    this.onContentChange();
  }

  // Handle keyboard shortcuts and special keys
  onTextareaKeydown(event: KeyboardEvent) {
    // Handle Ctrl/Cmd shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'l':
          event.preventDefault();
          this.insertList();
          break;
      }
      return;
    }

    // Handle Enter key for auto-continuing lists
    if (event.key === 'Enter') {
      this.handleEnterKey(event);
    }
  }

  private handleEnterKey(event: KeyboardEvent) {
    const textarea = event.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const beforeCursor = this.content.substring(0, start);
    const lines = beforeCursor.split('\n');
    const currentLineIndex = lines.length - 1;
    const currentLine = lines[currentLineIndex];

    const listPattern = /^(\s*)([-*+])\s(.*)$/;
    const numberedListPattern = /^(\s*)(\d+)\.\s(.*)$/;

    let match = currentLine.match(listPattern);
    let isNumberedList = false;

    if (!match) {
      match = currentLine.match(numberedListPattern);
      isNumberedList = true;
    }

    if (match) {
      event.preventDefault();
      const [, indent, marker, content] = match;

      if (content.trim() === '') {
        // Empty list item - remove it and exit list mode
        const beforeLine = this.content.substring(0, start - currentLine.length);
        const afterCursor = this.content.substring(start);
        this.content = beforeLine + indent + afterCursor;
        this.onContentChange();

        setTimeout(() => {
          const newPos = start - currentLine.length + indent.length;
          textarea.setSelectionRange(newPos, newPos);
        });
      } else {
        // Continue the list
        let newMarker = marker;
        if (isNumberedList) {
          const num = parseInt(marker) + 1;
          newMarker = num.toString();
        }

        const newListItem = indent + newMarker + (isNumberedList ? '.' : '') + ' ';
        const afterCursor = this.content.substring(start);

        this.content = beforeCursor + '\n' + newListItem + afterCursor;
        this.onContentChange();

        setTimeout(() => {
          const newPos = start + 1 + newListItem.length;
          textarea.setSelectionRange(newPos, newPos);
        });
      }
    }
  }

  toggleFormattingToolbar() {
    this.showFormatting = !this.showFormatting;
  }

  private focusEditor() {
    setTimeout(() => {
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        // Position cursor at end if it's a new note, at beginning if loading existing
        if (this.isNewNote) {
          textarea.setSelectionRange(0, 0);
        }
      }
    }, 100);
  }

  getWordCount(): number {
    return this.content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  getCharCount(): number {
    return this.content.length;
  }

  getTags(): string[] {
    const tagRegex = /#([а-яё\w]+)/gi;
    const matches = this.content.match(tagRegex);
    if (!matches) return [];
    return [...new Set(matches.map((match) => match.substring(1).toLowerCase()))];
  }
}
