import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  element: string;
  selector: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'color' | 'contrast' | 'keyboard' | 'screen_reader' | 'focus' | 'semantic' | 'aria';
  recommendation: string;
  timestamp: Date;
}

export interface AccessibilityReport {
  totalIssues: number;
  issuesByType: {[key: string]: number};
  issuesBySeverity: {[key: string]: number};
  issuesByCategory: {[key: string]: number};
  issues: AccessibilityIssue[];
  score: number;
  recommendations: string[];
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
  colorBlind: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  private accessibilityIssuesSubject = new BehaviorSubject<AccessibilityIssue[]>([]);
  private accessibilitySettingsSubject = new BehaviorSubject<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: false,
    focusVisible: false,
    colorBlind: 'none'
  });

  get accessibilityIssues$(): Observable<AccessibilityIssue[]> {
    return this.accessibilityIssuesSubject.asObservable();
  }

  get accessibilitySettings$(): Observable<AccessibilitySettings> {
    return this.accessibilitySettingsSubject.asObservable();
  }

  constructor() {
    this.initializeAccessibility();
  }

  private initializeAccessibility(): void {
    this.detectSystemPreferences();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupScreenReaderSupport();
    this.setupColorContrast();
    this.setupMotionPreferences();
  }

  private detectSystemPreferences(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
      if (highContrastQuery.matches) {
        this.updateSetting('highContrast', true);
      }

      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (reducedMotionQuery.matches) {
        this.updateSetting('reducedMotion', true);
      }

      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (darkModeQuery.matches) {
        document.documentElement.classList.add('dark-mode');
      }
    }
  }

  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        this.updateSetting('keyboardNavigation', true);
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  private setupFocusManagement(): void {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        this.updateSetting('focusVisible', true);
        document.body.classList.add('focus-visible');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('focus-visible');
    });
  }

  private setupScreenReaderSupport(): void {
    if (typeof window !== 'undefined') {
      const hasScreenReader = window.speechSynthesis || 
                             window.navigator.userAgent.includes('NVDA') || 
                             window.navigator.userAgent.includes('JAWS') || 
                             window.navigator.userAgent.includes('VoiceOver');
      
      if (hasScreenReader) {
        this.updateSetting('screenReader', true);
      }
    }
  }

  private setupColorContrast(): void {
    this.checkColorContrast();
  }

  private setupMotionPreferences(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      if (reducedMotionQuery.matches) {
        this.updateSetting('reducedMotion', true);
        document.documentElement.classList.add('reduced-motion');
      }
    }
  }

  updateSetting(key: keyof AccessibilitySettings, value: any): void {
    const currentSettings = this.accessibilitySettingsSubject.value;
    const updatedSettings = { ...currentSettings, [key]: value };
    this.accessibilitySettingsSubject.next(updatedSettings);
    this.applySetting(key, value);
  }

  private applySetting(key: keyof AccessibilitySettings, value: any): void {
    switch (key) {
      case 'highContrast':
        if (value) {
          document.documentElement.classList.add('high-contrast');
        } else {
          document.documentElement.classList.remove('high-contrast');
        }
        break;
        
      case 'largeText':
        if (value) {
          document.documentElement.classList.add('large-text');
        } else {
          document.documentElement.classList.remove('large-text');
        }
        break;
        
      case 'reducedMotion':
        if (value) {
          document.documentElement.classList.add('reduced-motion');
        } else {
          document.documentElement.classList.remove('reduced-motion');
        }
        break;
        
      case 'colorBlind':
        document.documentElement.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
        if (value !== 'none') {
          document.documentElement.classList.add(value);
        }
        break;
    }
  }

  private checkColorContrast(): void {
    const elements = document.querySelectorAll('*');
    const issues: AccessibilityIssue[] = [];

    elements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      
      if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const contrastRatio = this.calculateContrastRatio(color, backgroundColor);
        
        if (contrastRatio < 4.5) {
          issues.push({
            id: this.generateIssueId(),
            type: 'error',
            message: `Low color contrast ratio: ${contrastRatio.toFixed(2)}`,
            element: element.tagName,
            selector: this.getElementSelector(element),
            severity: contrastRatio < 3 ? 'high' : 'medium',
            category: 'contrast',
            recommendation: 'Increase color contrast to meet WCAG AA standards (4.5:1)',
            timestamp: new Date()
          });
        }
      }
    });

    this.addIssues(issues);
  }

  private calculateContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;
    
    const luminance1 = this.getLuminance(rgb1);
    const luminance2 = this.getLuminance(rgb2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  private hexToRgb(hex: string): {r: number, g: number, b: number} | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  private getLuminance(rgb: {r: number, g: number, b: number}): number {
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  private getElementSelector(element: Element): string {
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className) {
      return `.${element.className.split(' ').join('.')}`;
    }
    
    return element.tagName.toLowerCase();
  }

  private generateIssueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private addIssues(issues: AccessibilityIssue[]): void {
    const currentIssues = this.accessibilityIssuesSubject.value;
    const updatedIssues = [...currentIssues, ...issues];
    this.accessibilityIssuesSubject.next(updatedIssues);
  }

  checkAltText(): void {
    const images = document.querySelectorAll('img');
    const issues: AccessibilityIssue[] = [];

    images.forEach((img) => {
      if (!img.alt) {
        issues.push({
          id: this.generateIssueId(),
          type: 'error',
          message: 'Image missing alt text',
          element: 'img',
          selector: this.getElementSelector(img),
          severity: 'high',
          category: 'screen_reader',
          recommendation: 'Add descriptive alt text to images',
          timestamp: new Date()
        });
      }
    });

    this.addIssues(issues);
  }

  checkFormLabels(): void {
    const inputs = document.querySelectorAll('input, textarea, select');
    const issues: AccessibilityIssue[] = [];

    inputs.forEach((input) => {
      const id = input.getAttribute('id');
      const label = document.querySelector(`label[for="${id}"]`);
      
      if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        issues.push({
          id: this.generateIssueId(),
          type: 'error',
          message: 'Form input missing label',
          element: input.tagName,
          selector: this.getElementSelector(input),
          severity: 'high',
          category: 'screen_reader',
          recommendation: 'Add a label or aria-label to form inputs',
          timestamp: new Date()
        });
      }
    });

    this.addIssues(issues);
  }

  checkHeadings(): void {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const issues: AccessibilityIssue[] = [];

    if (headings.length === 0) {
      issues.push({
        id: this.generateIssueId(),
        type: 'warning',
        message: 'Page missing heading structure',
        element: 'body',
        selector: 'body',
        severity: 'medium',
        category: 'semantic',
        recommendation: 'Add proper heading structure (h1, h2, h3, etc.)',
        timestamp: new Date()
      });
    }

    this.addIssues(issues);
  }

  checkAriaLabels(): void {
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    const issues: AccessibilityIssue[] = [];

    interactiveElements.forEach((element) => {
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby') && !element.textContent?.trim()) {
        issues.push({
          id: this.generateIssueId(),
          type: 'warning',
          message: 'Interactive element missing accessible name',
          element: element.tagName,
          selector: this.getElementSelector(element),
          severity: 'medium',
          category: 'aria',
          recommendation: 'Add aria-label or aria-labelledby to interactive elements',
          timestamp: new Date()
        });
      }
    });

    this.addIssues(issues);
  }

  runAccessibilityAudit(): AccessibilityReport {
    this.accessibilityIssuesSubject.next([]);
    
    this.checkColorContrast();
    this.checkAltText();
    this.checkFormLabels();
    this.checkHeadings();
    this.checkAriaLabels();
    
    const issues = this.accessibilityIssuesSubject.value;
    
    const report: AccessibilityReport = {
      totalIssues: issues.length,
      issuesByType: this.groupIssuesBy(issues, 'type'),
      issuesBySeverity: this.groupIssuesBy(issues, 'severity'),
      issuesByCategory: this.groupIssuesBy(issues, 'category'),
      issues,
      score: this.calculateAccessibilityScore(issues),
      recommendations: this.generateRecommendations(issues)
    };
    
    return report;
  }

  private groupIssuesBy(issues: AccessibilityIssue[], property: keyof AccessibilityIssue): {[key: string]: number} {
    return issues.reduce((acc, issue) => {
      const value = issue[property] as string;
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as {[key: string]: number});
  }

  private calculateAccessibilityScore(issues: AccessibilityIssue[]): number {
    if (issues.length === 0) return 100;
    
    const severityWeights = { low: 1, medium: 2, high: 3, critical: 4 };
    const totalWeight = issues.reduce((sum, issue) => sum + severityWeights[issue.severity], 0);
    const maxWeight = issues.length * 4;
    
    return Math.max(0, 100 - (totalWeight / maxWeight) * 100);
  }

  private generateRecommendations(issues: AccessibilityIssue[]): string[] {
    const recommendations: string[] = [];
    
    const contrastIssues = issues.filter(i => i.category === 'contrast');
    if (contrastIssues.length > 0) {
      recommendations.push('Improve color contrast ratios to meet WCAG AA standards');
    }
    
    const altTextIssues = issues.filter(i => i.message.includes('alt text'));
    if (altTextIssues.length > 0) {
      recommendations.push('Add descriptive alt text to all images');
    }
    
    const labelIssues = issues.filter(i => i.message.includes('label'));
    if (labelIssues.length > 0) {
      recommendations.push('Ensure all form inputs have proper labels');
    }
    
    const headingIssues = issues.filter(i => i.message.includes('heading'));
    if (headingIssues.length > 0) {
      recommendations.push('Implement proper heading structure for better navigation');
    }
    
    const ariaIssues = issues.filter(i => i.category === 'aria');
    if (ariaIssues.length > 0) {
      recommendations.push('Add ARIA labels to interactive elements');
    }
    
    return recommendations;
  }

  announce(message: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  getCurrentSettings(): AccessibilitySettings {
    return this.accessibilitySettingsSubject.value;
  }

  getIssues(): AccessibilityIssue[] {
    return this.accessibilityIssuesSubject.value;
  }

  clearIssues(): void {
    this.accessibilityIssuesSubject.next([]);
  }
}