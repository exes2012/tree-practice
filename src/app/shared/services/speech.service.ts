import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private repetitionInterval: any;
  private isRepetitionActive: boolean = false;

  speak(text: string, isRepetition: boolean = false): void {
    if (!text) return;
    
    if (!isRepetition) {
      window.speechSynthesis.cancel();
    }
    
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  startRepetition(phrase: string, intervalMs: number = 15000): void {
    this.clearRepetition();
    this.isRepetitionActive = true;
    
    if (phrase) {
      this.speak(phrase, true);
      this.repetitionInterval = setInterval(() => {
        if (this.isRepetitionActive) {
          this.speak(phrase, true);
        }
      }, intervalMs);
    }
  }

  clearRepetition(): void {
    this.isRepetitionActive = false;
    if (this.repetitionInterval) {
      clearInterval(this.repetitionInterval);
      this.repetitionInterval = null;
    }
    window.speechSynthesis.cancel();
  }

  stopSpeech(): void {
    window.speechSynthesis.cancel();
  }

  getIsRepetitionActive(): boolean {
    return this.isRepetitionActive;
  }
}
