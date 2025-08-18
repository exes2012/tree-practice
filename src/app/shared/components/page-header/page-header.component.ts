import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Location, CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() showEditButton: boolean = false;
  @Output() editClicked = new EventEmitter<void>();
  @Output() backClicked = new EventEmitter<void>();

  constructor(private location: Location) {}

  goBack(): void {
    if (this.backClicked.observed) {
      this.backClicked.emit();
    } else {
      this.location.back();
    }
  }

  onEditClick(): void {
    this.editClicked.emit();
  }
}
