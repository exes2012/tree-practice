import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-time-picker',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTimePickerComponent),
      multi: true
    }
  ],
  template: `
    <div class="custom-time-picker">
      <div class="time-input-container">
        <div class="time-field">
          <input
            type="number"
            min="0"
            max="23"
            [value]="hours"
            (input)="onHoursChange($event)"
            (blur)="onBlur()"
            class="time-input"
            placeholder="00">
          <span class="time-label">ч</span>
        </div>
        
        <span class="time-separator">:</span>
        
        <div class="time-field">
          <input
            type="number"
            min="0"
            max="59"
            [value]="minutes"
            (input)="onMinutesChange($event)"
            (blur)="onBlur()"
            class="time-input"
            placeholder="00">
          <span class="time-label">м</span>
        </div>
      </div>
      
      <div class="time-controls">
        <button type="button" (click)="incrementHours()" class="time-btn">
          <i class="material-icons">keyboard_arrow_up</i>
        </button>
        <button type="button" (click)="decrementHours()" class="time-btn">
          <i class="material-icons">keyboard_arrow_down</i>
        </button>
        <button type="button" (click)="incrementMinutes()" class="time-btn">
          <i class="material-icons">keyboard_arrow_up</i>
        </button>
        <button type="button" (click)="decrementMinutes()" class="time-btn">
          <i class="material-icons">keyboard_arrow_down</i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .custom-time-picker {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 1px solid #d1d5db;
      border-radius: 12px;
      background: white;
      transition: all 0.2s ease;
    }
    
    .custom-time-picker:focus-within {
      border-color: #9ca3af;
      box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.2);
    }
    
    .dark .custom-time-picker {
      background: #374151;
      border-color: #4b5563;
      color: #e5e7eb;
    }
    
    .time-input-container {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
    }
    
    .time-field {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .time-input {
      width: 40px;
      padding: 4px 8px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      background: #f9fafb;
      color: #374151;
      outline: none;
      transition: all 0.2s ease;
    }
    
    .time-input:focus {
      border-color: #9ca3af;
      background: white;
      box-shadow: 0 0 0 1px rgba(107, 114, 128, 0.2);
    }
    
    .dark .time-input {
      background: #1f2937;
      border-color: #374151;
      color: #e5e7eb;
    }
    
    .dark .time-input:focus {
      background: #111827;
      border-color: #6b7280;
    }
    
    .time-separator {
      font-size: 18px;
      font-weight: bold;
      color: #6b7280;
      margin: 0 4px;
    }
    
    .time-label {
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
    }
    
    .time-controls {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 2px;
    }
    
    .time-btn {
      width: 24px;
      height: 24px;
      border: none;
      background: #f3f4f6;
      color: #6b7280;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .time-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }
    
    .time-btn .material-icons {
      font-size: 16px;
    }
    
    .dark .time-btn {
      background: #4b5563;
      color: #9ca3af;
    }
    
    .dark .time-btn:hover {
      background: #6b7280;
      color: #f3f4f6;
    }
  `]
})
export class CustomTimePickerComponent implements ControlValueAccessor {
  hours: string = '00';
  minutes: string = '00';
  
  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    if (value) {
      const [h, m] = value.split(':');
      this.hours = h?.padStart(2, '0') || '00';
      this.minutes = m?.padStart(2, '0') || '00';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onHoursChange(event: any): void {
    let value = parseInt(event.target.value) || 0;
    value = Math.max(0, Math.min(23, value));
    this.hours = value.toString().padStart(2, '0');
    this.emitValue();
  }

  onMinutesChange(event: any): void {
    let value = parseInt(event.target.value) || 0;
    value = Math.max(0, Math.min(59, value));
    this.minutes = value.toString().padStart(2, '0');
    this.emitValue();
  }

  incrementHours(): void {
    let h = parseInt(this.hours) || 0;
    h = (h + 1) % 24;
    this.hours = h.toString().padStart(2, '0');
    this.emitValue();
  }

  decrementHours(): void {
    let h = parseInt(this.hours) || 0;
    h = h === 0 ? 23 : h - 1;
    this.hours = h.toString().padStart(2, '0');
    this.emitValue();
  }

  incrementMinutes(): void {
    let m = parseInt(this.minutes) || 0;
    m = (m + 1) % 60;
    this.minutes = m.toString().padStart(2, '0');
    this.emitValue();
  }

  decrementMinutes(): void {
    let m = parseInt(this.minutes) || 0;
    m = m === 0 ? 59 : m - 1;
    this.minutes = m.toString().padStart(2, '0');
    this.emitValue();
  }

  onBlur(): void {
    this.onTouched();
  }

  private emitValue(): void {
    const timeValue = `${this.hours}:${this.minutes}`;
    this.onChange(timeValue);
  }
}
