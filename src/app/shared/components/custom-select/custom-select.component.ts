import { Component, Input, Output, EventEmitter, forwardRef, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="custom-select" [class.open]="isOpen" [class.disabled]="disabled">
      <div 
        class="select-trigger"
        (click)="toggle()"
        [class.has-value]="selectedOption">
        <span class="select-value">
          {{ selectedOption?.label || placeholder }}
        </span>
        <i class="material-icons select-arrow" [class.rotated]="isOpen">expand_more</i>
      </div>
      
      <div class="select-dropdown" *ngIf="isOpen" #dropdown>
        <div class="select-options">
          <div 
            *ngFor="let option of options"
            class="select-option"
            [class.selected]="option.value === value"
            [class.disabled]="option.disabled"
            (click)="selectOption(option)">
            {{ option.label }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Backdrop -->
    <div 
      *ngIf="isOpen" 
      class="select-backdrop"
      (click)="close()">
    </div>
  `,
  styles: [`
    .custom-select {
      position: relative;
      width: 100%;
    }
    
    .select-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 12px;
      background: white;
      cursor: pointer;
      transition: all 0.2s ease;
      min-height: 48px;
      position: relative;

      /* Агрессивно скрываем любые стандартные стрелки */
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
      appearance: none !important;
      background-image: none !important;

      /* Убираем все псевдоэлементы */
      &::before,
      &::after {
        display: none !important;
        content: none !important;
      }

      /* Убираем стрелки из дочерних элементов */
      * {
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        appearance: none !important;
        background-image: none !important;

        &::before,
        &::after {
          display: none !important;
          content: none !important;
        }
      }
    }
    
    .select-trigger:hover {
      border-color: #9ca3af;
    }
    
    .custom-select.open .select-trigger {
      border-color: #9ca3af;
      box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.2);
    }
    
    .custom-select.disabled .select-trigger {
      background: #f3f4f6;
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    .dark .select-trigger {
      background: #374151;
      border-color: #4b5563;
      color: #e5e7eb;
    }
    
    .dark .select-trigger:hover {
      border-color: #6b7280;
    }
    
    .select-value {
      flex: 1;
      text-align: left;
      color: #374151;
      font-size: 14px;
    }
    
    .select-trigger:not(.has-value) .select-value {
      color: #9ca3af;
    }
    
    .dark .select-value {
      color: #e5e7eb;
    }
    
    .dark .select-trigger:not(.has-value) .select-value {
      color: #6b7280;
    }
    
    .select-arrow {
      color: #6b7280;
      transition: transform 0.2s ease;
      font-size: 20px;
    }
    
    .select-arrow.rotated {
      transform: rotate(180deg);
    }
    
    .select-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 1000;
      margin-top: 4px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .dark .select-dropdown {
      background: #374151;
      border-color: #4b5563;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
    
    .select-options {
      max-height: 200px;
      overflow-y: auto;
    }
    
    .select-option {
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      color: #374151;
      font-size: 14px;
    }
    
    .select-option:hover {
      background: #f3f4f6;
    }
    
    .select-option.selected {
      background: #e5e7eb;
      font-weight: 500;
    }
    
    .select-option.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .dark .select-option {
      color: #e5e7eb;
    }
    
    .dark .select-option:hover {
      background: #4b5563;
    }
    
    .dark .select-option.selected {
      background: #6b7280;
    }
    
    .select-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999;
      background: transparent;
    }
  `]
})
export class CustomSelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Выберите...';
  @Input() disabled: boolean = false;
  @ViewChild('dropdown') dropdown!: ElementRef;

  isOpen = false;
  value: any = null;
  selectedOption: SelectOption | null = null;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
    this.selectedOption = this.options.find(option => option.value === value) || null;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(): void {
    if (this.disabled) return;
    
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
    this.onTouched();
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;
    
    this.value = option.value;
    this.selectedOption = option;
    this.onChange(option.value);
    this.close();
  }
}
