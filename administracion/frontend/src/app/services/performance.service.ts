import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  category: 'navigation' | 'resource' | 'paint' | 'layout' | 'script' | 'network';
}

export interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  timestamp: number;
  details?: any;
}

export interface PerformanceReport {
  totalLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  speedIndex: number;
  metrics: PerformanceMetric[];
  recommendations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private performanceMetricsSubject = new BehaviorSubject<PerformanceMetric[]>([]);
  private performanceReportSubject = new BehaviorSubject<PerformanceReport | null>(null);

  get performanceMetrics$(): Observable<PerformanceMetric[]> {
    return this.performanceMetricsSubject.asObservable();
  }

  get performanceReport$(): Observable<PerformanceReport | null> {
    return this.performanceReportSubject.asObservable();
  }

  constructor() {
    this.initializePerformanceMonitoring();
  }

  // Initialize performance monitoring
  private initializePerformanceMonitoring(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor page load performance
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.measurePageLoadPerformance();
        }, 1000);
      });

      // Monitor navigation performance
      this.observeNavigationTiming();
      
      // Monitor resource performance
      this.observeResourceTiming();
      
      // Monitor paint performance
      this.observePaintTiming();
      
      // Monitor layout performance
      this.observeLayoutTiming();
      
      // Monitor script performance
      this.observeScriptTiming();
      
      // Monitor network performance
      this.observeNetworkTiming();
    }
  }

  // Measure page load performance
  private measurePageLoadPerformance(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const metrics: PerformanceMetric[] = [
        {
          name: 'DNS Lookup',
          value: navigation.domainLookupEnd - navigation.domainLookupStart,
          unit: 'ms',
          timestamp: new Date(),
          category: 'network'
        },
        {
          name: 'TCP Connection',
          value: navigation.connectEnd - navigation.connectStart,
          unit: 'ms',
          timestamp: new Date(),
          category: 'network'
        },
        {
          name: 'Request Time',
          value: navigation.responseStart - navigation.requestStart,
          unit: 'ms',
          timestamp: new Date(),
          category: 'network'
        },
        {
          name: 'Response Time',
          value: navigation.responseEnd - navigation.responseStart,
          unit: 'ms',
          timestamp: new Date(),
          category: 'network'
        },
        {
          name: 'DOM Processing',
          value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          unit: 'ms',
          timestamp: new Date(),
          category: 'script'
        },
        {
          name: 'Load Complete',
          value: navigation.loadEventEnd - navigation.loadEventStart,
          unit: 'ms',
          timestamp: new Date(),
          category: 'navigation'
        }
      ];

      this.addMetrics(metrics);
    }
  }

  // Observe navigation timing
  private observeNavigationTiming(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const metric: PerformanceMetric = {
              name: 'Page Load',
              value: navEntry.loadEventEnd - navEntry.navigationStart,
              unit: 'ms',
              timestamp: new Date(),
              category: 'navigation'
            };
            this.addMetric(metric);
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  // Observe resource timing
  private observeResourceTiming(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            const metric: PerformanceMetric = {
              name: `Resource: ${this.getResourceName(resourceEntry.name)}`,
              value: resourceEntry.duration,
              unit: 'ms',
              timestamp: new Date(),
              category: 'resource'
            };
            this.addMetric(metric);
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  // Observe paint timing
  private observePaintTiming(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'paint') {
            const paintEntry = entry as PerformancePaintTiming;
            const metric: PerformanceMetric = {
              name: paintEntry.name === 'first-contentful-paint' ? 'First Contentful Paint' : 'First Paint',
              value: paintEntry.startTime,
              unit: 'ms',
              timestamp: new Date(),
              category: 'paint'
            };
            this.addMetric(metric);
          }
        });
      });

      observer.observe({ entryTypes: ['paint'] });
    }
  }

  // Observe layout timing
  private observeLayoutTiming(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'layout-shift') {
            const layoutEntry = entry as any;
            const metric: PerformanceMetric = {
              name: 'Layout Shift',
              value: layoutEntry.value,
              unit: 'score',
              timestamp: new Date(),
              category: 'layout'
            };
            this.addMetric(metric);
          }
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  // Observe script timing
  private observeScriptTiming(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'measure') {
            const measureEntry = entry as PerformanceMeasure;
            const metric: PerformanceMetric = {
              name: `Script: ${measureEntry.name}`,
              value: measureEntry.duration,
              unit: 'ms',
              timestamp: new Date(),
              category: 'script'
            };
            this.addMetric(metric);
          }
        });
      });

      observer.observe({ entryTypes: ['measure'] });
    }
  }

  // Observe network timing
  private observeNetworkTiming(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const metric: PerformanceMetric = {
              name: 'Network Time',
              value: navEntry.responseEnd - navEntry.requestStart,
              unit: 'ms',
              timestamp: new Date(),
              category: 'network'
            };
            this.addMetric(metric);
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  // Add a single metric
  private addMetric(metric: PerformanceMetric): void {
    const currentMetrics = this.performanceMetricsSubject.value;
    const updatedMetrics = [...currentMetrics, metric].slice(-100); // Keep last 100 metrics
    this.performanceMetricsSubject.next(updatedMetrics);
  }

  // Add multiple metrics
  private addMetrics(metrics: PerformanceMetric[]): void {
    const currentMetrics = this.performanceMetricsSubject.value;
    const updatedMetrics = [...currentMetrics, ...metrics].slice(-100); // Keep last 100 metrics
    this.performanceMetricsSubject.next(updatedMetrics);
  }

  // Get resource name from URL
  private getResourceName(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop() || '';
      return filename || urlObj.hostname;
    } catch {
      return url;
    }
  }

  // Measure custom performance
  measurePerformance(name: string, fn: () => void): void {
    const startTime = performance.now();
    fn();
    const endTime = performance.now();
    
    const metric: PerformanceMetric = {
      name: `Custom: ${name}`,
      value: endTime - startTime,
      unit: 'ms',
      timestamp: new Date(),
      category: 'script'
    };
    
    this.addMetric(metric);
  }

  // Measure async performance
  async measureAsyncPerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await fn();
      const endTime = performance.now();
      
      const metric: PerformanceMetric = {
        name: `Async: ${name}`,
        value: endTime - startTime,
        unit: 'ms',
        timestamp: new Date(),
        category: 'script'
      };
      
      this.addMetric(metric);
      return result;
    } catch (error) {
      const endTime = performance.now();
      
      const metric: PerformanceMetric = {
        name: `Async Error: ${name}`,
        value: endTime - startTime,
        unit: 'ms',
        timestamp: new Date(),
        category: 'script'
      };
      
      this.addMetric(metric);
      throw error;
    }
  }

  // Get performance report
  getPerformanceReport(): PerformanceReport {
    const metrics = this.performanceMetricsSubject.value;
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const report: PerformanceReport = {
      totalLoadTime: navigation ? navigation.loadEventEnd - navigation.navigationStart : 0,
      firstContentfulPaint: this.getMetricValue('First Contentful Paint'),
      largestContentfulPaint: this.getMetricValue('Largest Contentful Paint'),
      firstInputDelay: this.getMetricValue('First Input Delay'),
      cumulativeLayoutShift: this.getMetricValue('Layout Shift'),
      timeToInteractive: this.getMetricValue('Time to Interactive'),
      totalBlockingTime: this.getMetricValue('Total Blocking Time'),
      speedIndex: this.getMetricValue('Speed Index'),
      metrics,
      recommendations: this.generateRecommendations(metrics)
    };

    this.performanceReportSubject.next(report);
    return report;
  }

  // Get metric value by name
  private getMetricValue(name: string): number {
    const metrics = this.performanceMetricsSubject.value;
    const metric = metrics.find(m => m.name === name);
    return metric ? metric.value : 0;
  }

  // Generate performance recommendations
  private generateRecommendations(metrics: PerformanceMetric[]): string[] {
    const recommendations: string[] = [];
    
    const totalLoadTime = this.getMetricValue('Page Load');
    if (totalLoadTime > 3000) {
      recommendations.push('Page load time is slow. Consider optimizing images, reducing JavaScript bundle size, or implementing lazy loading.');
    }
    
    const firstContentfulPaint = this.getMetricValue('First Contentful Paint');
    if (firstContentfulPaint > 1500) {
      recommendations.push('First Contentful Paint is slow. Consider optimizing critical rendering path and reducing render-blocking resources.');
    }
    
    const layoutShift = this.getMetricValue('Layout Shift');
    if (layoutShift > 0.1) {
      recommendations.push('Layout shift detected. Consider setting dimensions for images and avoiding dynamically injected content.');
    }
    
    const resourceMetrics = metrics.filter(m => m.category === 'resource');
    const slowResources = resourceMetrics.filter(m => m.value > 1000);
    if (slowResources.length > 0) {
      recommendations.push('Some resources are loading slowly. Consider optimizing or preloading critical resources.');
    }
    
    return recommendations;
  }

  // Clear performance metrics
  clearMetrics(): void {
    this.performanceMetricsSubject.next([]);
    this.performanceReportSubject.next(null);
  }

  // Get metrics by category
  getMetricsByCategory(category: string): PerformanceMetric[] {
    return this.performanceMetricsSubject.value.filter(m => m.category === category);
  }

  // Get average metric value
  getAverageMetricValue(name: string): number {
    const metrics = this.performanceMetricsSubject.value.filter(m => m.name === name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  // Export performance data
  exportPerformanceData(): string {
    const report = this.getPerformanceReport();
    return JSON.stringify(report, null, 2);
  }
}



