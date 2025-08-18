import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-fall-recovery',
  imports: [],
  templateUrl: './fall-recovery.component.html',
  styleUrl: './fall-recovery.component.scss',
})
export class FallRecoveryComponent {
  constructor(private location: Location) {}
  goBack() {
    this.location.back();
  }
  startPractice() {
    alert('Выход из падения будет реализован в следующих версиях');
  }
}
