import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeHeaderComponent {
  // Component simplified - no side menu logic needed
}
