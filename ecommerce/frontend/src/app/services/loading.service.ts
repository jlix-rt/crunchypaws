import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount = signal(0);
  public loading = signal(false);

  // Show loading
  show(): void {
    this.loadingCount.update(count => count + 1);
    this.loading.set(true);
  }

  // Hide loading
  hide(): void {
    this.loadingCount.update(count => Math.max(0, count - 1));
    
    if (this.loadingCount() === 0) {
      this.loading.set(false);
    }
  }

  // Force hide all loading
  hideAll(): void {
    this.loadingCount.set(0);
    this.loading.set(false);
  }

  // Get current loading state
  isLoading(): boolean {
    return this.loading();
  }
}
