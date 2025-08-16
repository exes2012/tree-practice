import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../../../core/services/notes.service';

@Component({
  selector: 'app-note-card',
  imports: [CommonModule],
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent {
  @Input() note!: Note;
  @Output() delete = new EventEmitter<void>();
  @Output() toggleFavorite = new EventEmitter<void>();

  onDelete(event: Event) {
    event.stopPropagation();
    this.delete.emit();
  }

  onToggleFavorite(event: Event) {
    event.stopPropagation();
    this.toggleFavorite.emit();
  }

  getPreviewText(): string {
    if (!this.note.content) return '';
    
    // Remove hashtags and clean up text for preview
    const cleanText = this.note.content
      .replace(/#\w+/g, '') // Remove hashtags
      .replace(/\n+/g, ' ') // Replace line breaks with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    return cleanText.length > 120 ? cleanText.substring(0, 117) + '...' : cleanText;
  }

  getRelativeTime(): string {
    const now = new Date();
    const updated = new Date(this.note.updatedAt);
    const diffMs = now.getTime() - updated.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return diffDays === 1 ? 'вчера' : `${diffDays} дн. назад`;
    } else if (diffHours > 0) {
      return diffHours === 1 ? '1 час назад' : `${diffHours} ч. назад`;
    } else if (diffMinutes > 0) {
      return diffMinutes === 1 ? '1 мин. назад' : `${diffMinutes} мин. назад`;
    } else {
      return 'только что';
    }
  }

  formatDate(): string {
    const date = new Date(this.note.updatedAt);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}