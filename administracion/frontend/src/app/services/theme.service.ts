import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Theme {
  name: string;
  displayName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  isDark: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>(this.getDefaultTheme());
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);

  get currentTheme$(): Observable<Theme> {
    return this.currentThemeSubject.asObservable();
  }

  get isDarkMode$(): Observable<boolean> {
    return this.isDarkModeSubject.asObservable();
  }

  get currentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  get isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  private readonly themes: Theme[] = [
    {
      name: 'light',
      displayName: 'Claro',
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      accentColor: '#f59e0b',
      backgroundColor: '#ffffff',
      surfaceColor: '#f8fafc',
      textColor: '#1e293b',
      isDark: false
    },
    {
      name: 'dark',
      displayName: 'Oscuro',
      primaryColor: '#60a5fa',
      secondaryColor: '#94a3b8',
      accentColor: '#fbbf24',
      backgroundColor: '#0f172a',
      surfaceColor: '#1e293b',
      textColor: '#f1f5f9',
      isDark: true
    },
    {
      name: 'blue',
      displayName: 'Azul',
      primaryColor: '#1e40af',
      secondaryColor: '#475569',
      accentColor: '#dc2626',
      backgroundColor: '#f0f9ff',
      surfaceColor: '#e0f2fe',
      textColor: '#0c4a6e',
      isDark: false
    },
    {
      name: 'green',
      displayName: 'Verde',
      primaryColor: '#059669',
      secondaryColor: '#6b7280',
      accentColor: '#d97706',
      backgroundColor: '#f0fdf4',
      surfaceColor: '#dcfce7',
      textColor: '#064e3b',
      isDark: false
    }
  ];

  constructor() {
    this.loadTheme();
  }

  setTheme(themeName: string): void {
    const theme = this.themes.find(t => t.name === themeName);
    if (theme) {
      this.currentThemeSubject.next(theme);
      this.isDarkModeSubject.next(theme.isDark);
      this.applyTheme(theme);
      this.saveTheme(themeName);
    }
  }

  toggleDarkMode(): void {
    const newDarkMode = !this.isDarkMode;
    this.isDarkModeSubject.next(newDarkMode);
    
    const currentTheme = this.currentTheme;
    const updatedTheme = { ...currentTheme, isDark: newDarkMode };
    this.currentThemeSubject.next(updatedTheme);
    this.applyTheme(updatedTheme);
  }

  getAvailableThemes(): Theme[] {
    return this.themes;
  }

  private getDefaultTheme(): Theme {
    return this.themes[0]; // Default to light theme
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--background-color', theme.backgroundColor);
    root.style.setProperty('--surface-color', theme.surfaceColor);
    root.style.setProperty('--text-color', theme.textColor);
    
    if (theme.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  private saveTheme(themeName: string): void {
    localStorage.setItem('admin-theme', themeName);
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('admin-theme');
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      this.applyTheme(this.currentTheme);
    }
  }
}



