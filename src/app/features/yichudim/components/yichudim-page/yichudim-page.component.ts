import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LovePracticeComponent } from '../love-practice/love-practice.component';
import { BreathingJoyPracticeComponent } from '../breathing-joy-practice/breathing-joy-practice.component';
import { DivineSpacePracticeComponent } from '../divine-space-practice/divine-space-practice.component';
import { CandleFlamePracticeComponent } from '../candle-flame-practice/candle-flame-practice.component';
import { GratitudePracticeComponent } from '../gratitude-practice/gratitude-practice.component';
import { TetragrammatonPracticeComponent } from '../tetragrammaton-practice/tetragrammaton-practice.component';
import { ShabbatPracticeComponent } from '../shabbat-practice/shabbat-practice.component';

@Component({
  selector: 'app-yichudim-page',
  standalone: true,
  imports: [
    CommonModule,
    LovePracticeComponent,
    BreathingJoyPracticeComponent,
    DivineSpacePracticeComponent,
    CandleFlamePracticeComponent,
    GratitudePracticeComponent,
    TetragrammatonPracticeComponent,
    ShabbatPracticeComponent
  ],
  templateUrl: './yichudim-page.component.html',
  styleUrl: './yichudim-page.component.scss'
})
export class YichudimPageComponent {
  selectedPractice: string | null = null;

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  startPractice(practiceType: string) {
    this.selectedPractice = practiceType;
  }
}
