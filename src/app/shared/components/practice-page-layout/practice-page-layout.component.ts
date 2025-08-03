import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../page-header/page-header.component';

@Component({
  selector: 'app-practice-page-layout',
  templateUrl: './practice-page-layout.component.html',
  styleUrls: ['./practice-page-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, PageHeaderComponent]
})
export class PracticePageLayoutComponent {
  @Input() title: string = '';
}
