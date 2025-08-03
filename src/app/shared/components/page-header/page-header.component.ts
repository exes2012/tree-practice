import { Component, Input } from '@angular/core';
import { Location, CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PageHeaderComponent {
  @Input() title: string = '';

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }
}
