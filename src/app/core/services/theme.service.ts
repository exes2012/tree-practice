import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'app-theme';
  private readonly DARK_CLASS = 'dark';

  // Reactive signal for theme state
  public theme = signal<Theme>(this.getStoredTheme());

  constructor() {
    // Apply theme when signal changes
    effect(() => {
      this.applyTheme(this.theme());
    });

    // Listen for system theme changes
    this.setupSystemThemeListener();

    // Apply initial theme
    this.applyTheme(this.theme());
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme;
    return stored && ['light', 'dark', 'system'].includes(stored) ? stored : 'system';
  }

  private applyTheme(theme: Theme): void {
    const shouldUseDark = this.shouldUseDarkMode(theme);
    const htmlElement = document.documentElement;

    if (shouldUseDark) {
      htmlElement.classList.add(this.DARK_CLASS);
    } else {
      htmlElement.classList.remove(this.DARK_CLASS);
    }
  }

  private shouldUseDarkMode(theme: Theme): boolean {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;

    // System preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', () => {
      if (this.theme() === 'system') {
        this.applyTheme('system');
      }
    });
  }
}
