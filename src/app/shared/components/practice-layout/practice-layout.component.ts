
import { Component, Input, Output, EventEmitter, OnDestroy, ContentChild, TemplateRef, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, AfterContentInit, AfterViewChecked, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-practice-layout',
  templateUrl: './practice-layout.component.html',
  styleUrls: ['./practice-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PracticeLayoutComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit, AfterViewChecked {


  // --- Inputs for Content ---
  @Input() practiceTitle: string = '';
  @Input() practiceDescription: string = '';
  @Input() steps: any[] = [];
  @Input() currentStepIndex: number = 0; // Now an input
  @Input() currentStepData: any; // New input for current step data

  // --- Inputs for Configuration ---
  @Input() showTimer: boolean = false;
  @Input() mainPracticeStepIndex: number = -1;
  @Input() disableAutoRating: boolean = false;
  @Input() disableAutoRepetition: boolean = false;
  @Input() disableAutoSpeech: boolean = false;

  // --- Inputs for Timer Options ---
  @Input() stepDurationOptions: number[] = [10, 15, 30, 60];
  @Input() practiceDurationOptions: number[] = [2, 5, 10, 15, 30, 60];
  @Input() selectedStepDuration: number = 30;
  @Input() selectedPracticeDuration: number = 5;

  // --- Outputs ---
  @Output() practiceFinished = new EventEmitter<any>();
  @Output() nextStepClicked = new EventEmitter<void>(); // New output
  @Output() previousStepClicked = new EventEmitter<void>(); // New output
  @Output() toggleRepetitionClicked = new EventEmitter<boolean>(); // New output

  // --- Template References ---
  @ContentChild('stepContent') stepContent!: TemplateRef<any>;

  // --- State Management ---
  isVoiceEnabled = true; // Keep voice control here
  isRepetitionActive = false; // Keep repetition state here
  isPracticeStarted = false;
  userRating = 5;

  // --- Timer & Repetition Properties ---
  stepTimer: number = 0;
  practiceTimer: number = 0;
  private stepInterval: any;
  private practiceInterval: any;
  private repetitionInterval: any;
  private audio: HTMLAudioElement;

  constructor(private location: Location, private router: Router, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.audio = new Audio('/assets/sound/bell.mp3');
  }

  ngOnInit() {
    this.stepTimer = this.selectedStepDuration;
    this.practiceTimer = this.selectedPracticeDuration * 60;

    // Auto-start practice for old-style components (without external step management)
    if (!this.currentStepData && this.steps.length > 0) {
      this.isPracticeStarted = true;
      this.runStepLogic();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('PracticeLayoutComponent: ngOnChanges called with changes:', changes);
    for (const propName in changes) {
      const change = changes[propName];
      console.log(`PracticeLayoutComponent: ${propName} changed from ${change.previousValue} to ${change.currentValue}`);
    }
    if (changes['steps']) {
      console.log('PracticeLayoutComponent: steps changed from', changes['steps'].previousValue, 'to', changes['steps'].currentValue);
    }
    if (changes['isPracticeStarted']) {
      console.log('PracticeLayoutComponent: isPracticeStarted changed from', changes['isPracticeStarted'].previousValue, 'to', changes['isPracticeStarted'].currentValue);
    }
  }

  ngAfterContentInit() {
    console.log('PracticeLayoutComponent: ngAfterContentInit - stepContent:', this.stepContent);
  }

  ngAfterViewChecked() {
    console.log('PracticeLayoutComponent: ngAfterViewChecked - isPracticeStarted:', this.isPracticeStarted);
  }

  ngOnDestroy() {
    console.log('PracticeLayoutComponent: ngOnDestroy');
    this.clearAllTimers();
    window.speechSynthesis.cancel();
  }

  // --- Helper Methods ---
  get currentStep() {
    // If currentStepData is provided as input, use it
    if (this.currentStepData) {
      return this.currentStepData;
    }
    // Otherwise, get from steps array using currentStepIndex
    return this.steps[this.currentStepIndex];
  }

  // --- Control Methods ---
  goBack() {
    this.clearAllTimers();
    window.speechSynthesis.cancel();
    this.location.back();
  }

  goHome() {
    this.clearAllTimers();
    window.speechSynthesis.cancel();
    this.router.navigate(['/']);
  }

  toggleVoice() {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    if (!this.isVoiceEnabled) {
      window.speechSynthesis.cancel();
      this.clearRepetition();
    }
  }

  startPractice() {
    this.isPracticeStarted = true;
    this.currentStepIndex = 0;

    // Only run step logic if not using external handlers
    if (!this.nextStepClicked.observed && !this.disableAutoSpeech) {
      this.runStepLogic();
    }
  }

  nextStep() {
    // If external handler is connected, use it
    if (this.nextStepClicked.observed) {
      this.nextStepClicked.emit();
    } else {
      // Internal navigation for old-style components
      if (this.currentStepIndex < this.steps.length - 1) {
        this.currentStepIndex++;
        this.runStepLogic();
      }
    }
  }

  previousStep() {
    // If external handler is connected, use it
    if (this.previousStepClicked.observed) {
      this.previousStepClicked.emit();
    } else {
      // Internal navigation for old-style components
      if (this.currentStepIndex > 0) {
        this.currentStepIndex--;
        this.runStepLogic();
      }
    }
  }

  finishPractice() {
    console.log('PracticeLayoutComponent: finishPractice called.');
    this.clearAllTimers();
    this.audio.play();
    this.currentStepIndex = this.steps.length - 1;
    this.speak(this.steps[this.currentStepIndex]?.instruction || '');
  }

  exitPractice() {
    console.log('PracticeLayoutComponent: exitPractice called.');
    this.practiceFinished.emit({ rating: this.userRating });
    this.goBack();
  }

  handleToggleRepetition() {
    // If external handler is connected, use it
    if (this.toggleRepetitionClicked.observed) {
      this.toggleRepetitionClicked.emit(!this.isRepetitionActive);
    } else {
      // Internal toggle for old-style components
      this.toggleRepetition();
    }
  }

  toggleRepetition() {
    console.log('PracticeLayoutComponent: toggleRepetition called. Before isRepetitionActive:', this.isRepetitionActive);
    this.isRepetitionActive = !this.isRepetitionActive;
    if (this.isRepetitionActive) {
      this.startRepetition();
    } else {
      this.clearRepetition();
      // Stop any ongoing speech when stopping repetition
      window.speechSynthesis.cancel();
    }
    console.log('PracticeLayoutComponent: toggleRepetition called. After isRepetitionActive:', this.isRepetitionActive);
  }

  // --- Rating Methods ---
  isLastStep(): boolean {
    return this.currentStepIndex === this.steps.length - 1;
  }

  isRatingStep(): boolean {
    const currentStep = this.currentStep;
    return currentStep && (
      (currentStep as any)?.showRating === true ||
      currentStep.title?.toLowerCase().includes('оценка') ||
      currentStep.instruction?.toLowerCase().includes('оцени') ||
      currentStep.instruction?.toLowerCase().includes('как прошла практика')
    );
  }

  getRatingIcon(): string {
    const icons = [
      'sentiment_very_dissatisfied', // 1
      'sentiment_dissatisfied',      // 2
      'sentiment_dissatisfied',      // 3
      'sentiment_neutral',           // 4
      'sentiment_neutral',           // 5
      'sentiment_satisfied',         // 6
      'sentiment_satisfied',         // 7
      'sentiment_very_satisfied',    // 8
      'sentiment_very_satisfied',    // 9
      'mood'                         // 10
    ];
    return icons[this.userRating - 1] || 'sentiment_neutral';
  }

  onRatingChange(event: any): void {
    this.userRating = parseInt(event.target.value);
  }

  finishPracticeWithRating(): void {
    console.log('PracticeLayoutComponent: finishPracticeWithRating called with rating:', this.userRating);
    this.clearAllTimers();
    this.practiceFinished.emit({ rating: this.userRating });

    // Check if this is a goals practice (has custom navigation)
    const currentUrl = window.location.pathname;
    const isGoalsPractice = currentUrl.includes('/goals/') && currentUrl.includes('/practice/');

    // Only navigate back automatically for non-goals practices
    if (!isGoalsPractice) {
      setTimeout(() => {
        this.goBack();
      }, 100);
    }
  }

  // --- Internal Logic ---
  private runStepLogic() {
    console.log('PracticeLayoutComponent: runStepLogic called. currentStepIndex:', this.currentStepIndex);
    this.clearAllTimers();
    const currentStep = this.steps[this.currentStepIndex];

    // Only auto-speak if not disabled
    if (!this.disableAutoSpeech) {
      this.speak(currentStep?.instruction || '');
    }

    if (currentStep?.repeatablePhrase && !this.disableAutoRepetition) {
      this.isRepetitionActive = true;
      this.startRepetition();
    } else {
      this.isRepetitionActive = false;
    }

    if (!this.showTimer || this.currentStepIndex >= this.steps.length - 1) {
      return;
    }

    if (this.currentStepIndex < this.mainPracticeStepIndex) {
      this.startStepTimer();
    } else if (this.currentStepIndex === this.mainPracticeStepIndex) {
      this.startPracticeTimer();
    }
  }

  private speak(text: string, isRepetition: boolean = false) {
    if (!this.isVoiceEnabled || !text) return;
    if (!isRepetition) {
        window.speechSynthesis.cancel();
    }
    // Clean HTML tags and get full text
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  // --- Timer & Repetition Logic ---
  setStepDuration(seconds: number) {
    console.log('PracticeLayoutComponent: setStepDuration called. seconds:', seconds);
    this.selectedStepDuration = seconds;
    this.stepTimer = seconds;
  }

  setPracticeDuration(minutes: number) {
    console.log('PracticeLayoutComponent: setPracticeDuration called. minutes:', minutes);
    this.selectedPracticeDuration = minutes;
    this.practiceTimer = minutes * 60;
  }

  private startStepTimer() {
    console.log('PracticeLayoutComponent: startStepTimer called.');
    this.stepTimer = this.selectedStepDuration;
    this.stepInterval = setInterval(() => {
      this.stepTimer--;
      if (this.stepTimer < 0) {
        this.nextStep();
      }
    }, 1000);
  }

  private startPracticeTimer() {
    console.log('PracticeLayoutComponent: startPracticeTimer called.');
    this.practiceTimer = this.selectedPracticeDuration * 60;
    this.practiceInterval = setInterval(() => {
      this.practiceTimer--;
      if (this.practiceTimer < 0) {
        this.finishPractice();
      }
    }, 1000);
  }

  private startRepetition() {
    console.log('PracticeLayoutComponent: startRepetition called.');
    this.clearRepetition();
    const phrase = this.steps[this.currentStepIndex]?.repeatablePhrase;
    if (phrase && this.isVoiceEnabled) {
      this.speak(phrase, true);
      this.repetitionInterval = setInterval(() => {
        if (this.isVoiceEnabled && this.isRepetitionActive) {
          this.speak(phrase, true);
        }
      }, 15000); // Increased to 15 seconds (10 + 5 additional)
    }
  }

  private clearRepetition() {
    console.log('PracticeLayoutComponent: clearRepetition called.');
    if (this.repetitionInterval) {
      clearInterval(this.repetitionInterval);
      this.repetitionInterval = null;
    }
  }

  private clearAllTimers() {
    console.log('PracticeLayoutComponent: clearAllTimers called.');
    clearInterval(this.stepInterval);
    clearInterval(this.practiceInterval);
    this.clearRepetition();
  }

  
}
