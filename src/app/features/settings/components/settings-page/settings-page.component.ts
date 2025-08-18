import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService, Theme } from '../../../../core/services/theme.service';

@Component({
  selector: 'app-settings-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent {
  fontSize = signal<'small' | 'medium' | 'large'>('medium');
  soundsEnabled = signal(true);
  privacyMode = signal(false);

  // Theme options for display
  themeOptions = [
    { value: 'light' as Theme, label: 'Светлая', icon: '☀️' },
    { value: 'dark' as Theme, label: 'Тёмная', icon: '🌙' },
    { value: 'system' as Theme, label: 'Системная', icon: '⚙️' },
  ];

  // Font size options
  fontSizeOptions = [
    { value: 'small' as const, label: 'Маленький', class: 'text-sm' },
    { value: 'medium' as const, label: 'Средний', class: 'text-base' },
    { value: 'large' as const, label: 'Большой', class: 'text-lg' },
  ];

  constructor(public themeService: ThemeService) {}

  onThemeChange(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  onFontSizeChange(size: 'small' | 'medium' | 'large'): void {
    this.fontSize.set(size);
    // Apply font size to document root
    const sizeClass = this.fontSizeOptions.find((opt) => opt.value === size)?.class || 'text-base';
    document.documentElement.className =
      document.documentElement.className.replace(/text-(sm|base|lg)/, '') + ` ${sizeClass}`;
  }

  onSoundsToggle(): void {
    this.soundsEnabled.update((enabled) => !enabled);
  }

  onPrivacyToggle(): void {
    this.privacyMode.update((enabled) => !enabled);
  }

  clearLocalData(): void {
    if (
      confirm('Вы уверены, что хотите очистить все локальные данные? Это действие нельзя отменить.')
    ) {
      localStorage.clear();
      sessionStorage.clear();
      // Reload to reset app state
      window.location.reload();
    }
  }
}
