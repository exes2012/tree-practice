import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  Practice,
  PracticeService,
  PracticeStats,
} from '../../../../core/services/practice.service';
import { JournalService } from '../../../../core/services/journal.service';
import { HomeHeaderComponent } from '../home-header/home-header.component';

interface IntentionPractice {
  title: string;
  description: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, HomeHeaderComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('fixedSection') fixedSection!: ElementRef;

  stats: PracticeStats = { totalPractices: 0, streak: 0, lastPracticeDate: '' };
  dailyChallenge: IntentionPractice | null = null;
  lastPractice: Practice | null = null;
  practicesTopPadding = 200; // Default padding
  private resizeObserver?: ResizeObserver;

  isChallengeExpanded = false;
  activeTab: 'right' | 'left' = 'right';

  // Расширенная статистика
  totalPracticeDays = 0;
  totalPracticeTime = 0; // в секундах

  constructor(
    private router: Router,
    private practiceService: PracticeService,
    private journalService: JournalService
  ) {}

  async ngOnInit() {
    const challenge = localStorage.getItem('dailyChallenge');
    if (challenge) {
      this.dailyChallenge = JSON.parse(challenge);
    }
    this.lastPractice = this.practiceService.getLastPractice();
    this.stats = this.practiceService.getPracticeStats();
    await this.loadExtendedStats();
    this.loadActiveTab();
  }

  ngAfterViewInit() {
    // Multiple attempts to ensure calculation happens after DOM is ready
    setTimeout(() => this.calculatePracticesTopPadding(), 0);
    setTimeout(() => this.calculatePracticesTopPadding(), 100);
    setTimeout(() => this.calculatePracticesTopPadding(), 300);

    // Set up ResizeObserver to watch for changes in the fixed section
    if (this.fixedSection && 'ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        this.calculatePracticesTopPadding();
      });
      this.resizeObserver.observe(this.fixedSection.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private calculatePracticesTopPadding() {
    if (this.fixedSection) {
      const fixedSectionHeight = this.fixedSection.nativeElement.offsetHeight;
      this.practicesTopPadding = fixedSectionHeight + 16; // 16px extra spacing
    }
  }

  navigateToPractice(practiceType: string) {
    if (practiceType === 'yichudim') {
      this.router.navigate(['/yichudim']);
    } else {
      this.router.navigate(['/practices', practiceType]);
    }
  }

  navigateToGoals() {
    this.router.navigate(['/goals']);
  }

  switchTab(tab: 'right' | 'left') {
    this.activeTab = tab;
    this.saveActiveTab();
  }

  private loadActiveTab() {
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab === 'left' || savedTab === 'right') {
      this.activeTab = savedTab;
    }
  }

  private saveActiveTab() {
    localStorage.setItem('activeTab', this.activeTab);
  }

  private async loadExtendedStats() {
    try {
      // Получаем все записи практик из базы данных
      const db = (await import('../../../../core/services/db.service')).db;
      const practiceRuns = await db.practice_runs.toArray();

      // Вычисляем общее количество дней практики
      const practiceDates = new Set(practiceRuns.map((run) => run.dateKey));
      this.totalPracticeDays = practiceDates.size;

      // Вычисляем общее время практики
      this.totalPracticeTime = practiceRuns
        .filter((run) => run.duration && run.duration > 0)
        .reduce((total, run) => total + (run.duration || 0), 0);
    } catch (error) {
      console.error('Error loading extended stats:', error);
    }
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const totalMinutes = Math.floor(seconds / 60);

    if (hours > 0) {
      return `${hours}`;
    } else if (totalMinutes > 0) {
      return `${totalMinutes}`;
    } else {
      return '0';
    }
  }

  formatDurationLabel(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const totalMinutes = Math.floor(seconds / 60);

    if (hours > 0) {
      return 'час всего';
    } else if (totalMinutes >= 60) {
      return 'час всего';
    } else if (totalMinutes > 0) {
      return 'мин всего';
    } else {
      return 'сек всего';
    }
  }

  repeatLastPractice() {
    if (this.lastPractice) {
      this.router.navigate([this.lastPractice.route]);
    }
  }

  toggleChallenge() {
    this.isChallengeExpanded = !this.isChallengeExpanded;
    // Recalculate padding after expansion/collapse
    setTimeout(() => this.calculatePracticesTopPadding(), 100);
  }

  clearChallenge() {
    localStorage.removeItem('dailyChallenge');
    this.dailyChallenge = null;
    // Recalculate padding after removing challenge
    setTimeout(() => this.calculatePracticesTopPadding(), 100);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculatePracticesTopPadding();
  }
}
