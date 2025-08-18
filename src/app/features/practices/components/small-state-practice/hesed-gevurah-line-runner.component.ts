import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticeService } from '@app/core/services/practice.service';
import { PracticeRunnerComponent } from '@app/shared/components/practice-runner/practice-runner.component';
import { ActivatedRoute, Router } from '@angular/router';
import { hesedGevurahLinePracticeConfig } from '@app/core/practices/small-state-practices';

@Component({
  selector: 'app-hesed-gevurah-line-runner',
  template: `
    <app-practice-runner 
      [config]="practiceConfig"
      (practiceFinished)="onPracticeFinished($event)">
    </app-practice-runner>
  `,
  standalone: true,
  imports: [CommonModule, PracticeRunnerComponent]
})
export class HesedGevurahLineRunnerComponent {
  practiceConfig = hesedGevurahLinePracticeConfig;

  constructor(
    private practiceService: PracticeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  onPracticeFinished(result: any): void {
    console.log('Practice finished with result:', result);
    this.practiceService.saveLastPractice({ 
      name: 'Средняя линия Хесед/Гвура', 
      route: '/practices/small-state/hesed-gevurah-line-runner' 
    });
    this.practiceService.recordPracticeCompletion();
    this.router.navigate(['/practices']);
  }
}