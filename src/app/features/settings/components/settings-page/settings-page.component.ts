import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService, Theme } from '../../../../core/services/theme.service';
import { BottomNavigationComponent } from '../../../../shared/components/bottom-navigation/bottom-navigation.component';

@Component({
  selector: 'app-settings-page',
  imports: [CommonModule, FormsModule, BottomNavigationComponent],
  templateUrl: './settings-page.component.html',
  
})
export class SettingsPageComponent {
  fontSize = signal<'small' | 'medium' | 'large'>('medium');
  activeTab = signal<'settings' | 'about'>('settings');

  // Theme options for display
  themeOptions = [
    { value: 'light' as Theme, label: 'Светлая', icon: 'light_mode' },
    { value: 'dark' as Theme, label: 'Тёмная', icon: 'dark_mode' },
    { value: 'system' as Theme, label: 'Системная', icon: 'computer' },
  ];

  // Font size options
  fontSizeOptions = [
    { value: 'small' as const, label: 'Маленький', class: 'text-sm' },
    { value: 'medium' as const, label: 'Средний', class: 'text-base' },
    { value: 'large' as const, label: 'Большой', class: 'text-lg' },
  ];

  constructor(
    public themeService: ThemeService,
    private router: Router
  ) {}

  goBackToHome(): void {
    this.router.navigate(['/home']);
  }

  switchTab(tab: 'settings' | 'about'): void {
    this.activeTab.set(tab);
  }

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
}
