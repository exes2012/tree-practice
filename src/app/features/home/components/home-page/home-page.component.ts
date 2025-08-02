import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Practice, PracticeService, PracticeStats } from '../../../../core/services/practice.service';

interface IntentionPractice {
  title: string;
  description: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit {
  stats: PracticeStats = { totalPractices: 0, streak: 0, lastPracticeDate: '' };
  dailyChallenge: IntentionPractice | null = null;
  lastPractice: Practice | null = null;

  isChallengeExpanded = false;

  constructor(private router: Router, private practiceService: PracticeService) {}

  ngOnInit() {
    const challenge = localStorage.getItem('dailyChallenge');
    if (challenge) {
      this.dailyChallenge = JSON.parse(challenge);
    }
    this.lastPractice = this.practiceService.getLastPractice();
    this.stats = this.practiceService.getPracticeStats();
  }

  navigateToPractice(practiceType: string) {
    if (practiceType === 'yichudim') {
      this.router.navigate(['/yichudim']);
    } else {
      this.router.navigate(['/practices', practiceType]);
    }
  }

  repeatLastPractice() {
    if (this.lastPractice) {
      this.router.navigate([this.lastPractice.route]);
    }
  }

  toggleChallenge() {
    this.isChallengeExpanded = !this.isChallengeExpanded;
  }

  clearChallenge() {
    localStorage.removeItem('dailyChallenge');
    this.dailyChallenge = null;
  }
}