
import { Component, Input, Output, EventEmitter, OnDestroy, ContentChild, TemplateRef, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, AfterContentInit, AfterViewChecked, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../page-header/page-header.component';

@Component({
  selector: 'app-practice-layout',
  templateUrl: './practice-layout.component.html',
  styleUrls: ['./practice-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent]
})
export class PracticeLayoutComponent implements OnInit, OnChanges, OnDestroy, AfterContentInit, AfterViewChecked {


  // --- Inputs for Content ---
  @Input() practiceTitle: string = '';
  @Input() practiceDescription: string = '';
  @Input() steps: any[] = [];

  // --- Inputs for Configuration ---
  @Input() showTimer: boolean = false;
  @Input() mainPracticeStepIndex: number = -1;

  // --- Inputs for Timer Options ---
  @Input() stepDurationOptions: number[] = [10, 15, 30, 60];
  @Input() practiceDurationOptions: number[] = [2, 5, 10, 15, 30, 60];
  @Input() selectedStepDuration: number = 30;
  @Input() selectedPracticeDuration: number = 5;

  // --- Outputs ---
  @Output() practiceFinished = new EventEmitter<any>();

  // --- Template References ---
  @ContentChild('stepContent') stepContent!: TemplateRef<any>;

  // --- State Management ---
  isPracticeStarted = false;
  currentStepIndex = 0;
  isVoiceEnabled = true;
  userRating = 5;
  isRepetitionActive = false;

  // --- Timer & Repetition Properties ---
  stepTimer: number = 0;
  practiceTimer: number = 0;
  private stepInterval: any;
  private practiceInterval: any;
  private repetitionInterval: any;
  private audio: HTMLAudioElement;

  constructor(private location: Location, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.audio = new Audio('/assets/sound/bell.mp3');
    console.log('PracticeLayoutComponent: Constructor called!');
    console.log('PracticeLayoutComponent: Initial inputs - practiceTitle:', this.practiceTitle, 'steps:', this.steps);
  }

  ngOnInit() {
    console.log('PracticeLayoutComponent: ngOnInit');
    console.log('PracticeLayoutComponent: practiceTitle:', this.practiceTitle);
    console.log('PracticeLayoutComponent: practiceDescription:', this.practiceDescription);
    console.log('PracticeLayoutComponent: steps:', this.steps);
    console.log('PracticeLayoutComponent: steps length:', this.steps?.length);
    console.log('PracticeLayoutComponent: showTimer:', this.showTimer);
    this.stepTimer = this.selectedStepDuration;
    this.practiceTimer = this.selectedPracticeDuration * 60;
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

  // --- Control Methods ---
  goBack() {
    this.clearAllTimers();
    window.speechSynthesis.cancel();
    this.location.back();
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
    this.runStepLogic();
  }

  nextStep() {
    console.log('PracticeLayoutComponent: nextStep called. Before currentStepIndex:', this.currentStepIndex);
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.runStepLogic();
    }
    console.log('PracticeLayoutComponent: nextStep called. After currentStepIndex:', this.currentStepIndex);
  }

  previousStep() {
    console.log('PracticeLayoutComponent: previousStep called. Before currentStepIndex:', this.currentStepIndex);
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.runStepLogic();
    }
    console.log('PracticeLayoutComponent: previousStep called. After currentStepIndex:', this.currentStepIndex);
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

  // --- Internal Logic ---
  private runStepLogic() {
    console.log('PracticeLayoutComponent: runStepLogic called. currentStepIndex:', this.currentStepIndex);
    this.clearAllTimers();
    const currentStep = this.steps[this.currentStepIndex];
    this.speak(currentStep?.instruction || '');

    if (currentStep?.repeatablePhrase) {
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
