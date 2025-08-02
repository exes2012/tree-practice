import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { CreatorSpacePracticeComponent } from './creator-space-practice.component';
import { ZeirAnpinSpacePracticeComponent } from './zeir-anpin-space-practice.component';
import { NetzHodLinePracticeComponent } from './netz-hod-line-practice.component';
import { HesedGevurahLinePracticeComponent } from './hesed-gevurah-line-practice.component';

@Component({
  selector: 'app-small-state-practice',
  templateUrl: './small-state-practice.component.html',
  styleUrls: ['./small-state-practice.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CreatorSpacePracticeComponent,
    ZeirAnpinSpacePracticeComponent,
    NetzHodLinePracticeComponent,
    HesedGevurahLinePracticeComponent
  ]
})
export class SmallStatePracticeComponent {
  selectedPractice: string | undefined;

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  startPractice(practiceType: string) {
    this.selectedPractice = practiceType;
  }
}
