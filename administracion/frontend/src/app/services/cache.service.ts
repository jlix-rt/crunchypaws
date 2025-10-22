import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of items in cache
  strategy?: 'lru' | 'fifo' | 'ttl'; // Cache eviction strategy
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  private maxSize = 1000;
  private strategy: 'lru' | 'fifo' | 'ttl' = 'lru';
  private accessOrder: string[] = []; // For LRU tracking

  constructor() {
    // Clean up expired items every minute
    setInterval(() => {
      this.cleanupExpiredItems();
    }, 60000);
  }

  // Set cache options
  setOptions(options: CacheOptions): void {
    if (options.ttl !== undefined) {
      this.defaultTTL = options.ttl;
    }
    if (options.maxSize !== undefined) {
      this.maxSize = options.maxSize;
    }
    if (options.strategy !== undefined) {
      this.strategy = options.strategy;
    }
  }

  // Get item from cache
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (this.isExpired(item)) {
      this.delete(key);
      return null;
    }

    // Update access order for LRU
    if (this.strategy === 'lru') {
      this.updateAccessOrder(key);
    }

    return item.data;
  }

  // Set item in cache
  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    };

    // Check if we need to evict items
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictItem();
    }

    this.cache.set(key, item);
    
    // Update access order for LRU
    if (this.strategy === 'lru') {
      this.updateAccessOrder(key);
    }
  }

  // Delete item from cache
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      this.removeFromAccessOrder(key);
    }
    return deleted;
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  // Check if key exists in cache
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) {
      return false;
    }
    
    if (this.isExpired(item)) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Get cache keys
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  // Get cache statistics
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    missRate: number;
    strategy: string;
    ttl: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // Would need to track hits/misses
      missRate: 0, // Would need to track hits/misses
      strategy: this.strategy,
      ttl: this.defaultTTL
    };
  }

  // Cache with Observable
  cacheObservable<T>(
    key: string,
    observable: Observable<T>,
    ttl?: number
  ): Observable<T> {
    // Check if data is in cache
    const cachedData = this.get<T>(key);
    if (cachedData !== null) {
      return of(cachedData);
    }

    // If not in cache, execute observable and cache result
    return observable.pipe(
      tap(data => {
        this.set(key, data, ttl);
      }),
      catchError(error => {
        console.error('Error in cached observable:', error);
        return throwError(error);
      })
    );
  }

  // Cache with function
  cacheFunction<T>(
    key: string,
    fn: () => T,
    ttl?: number
  ): T {
    // Check if data is in cache
    const cachedData = this.get<T>(key);
    if (cachedData !== null) {
      return cachedData;
    }

    // If not in cache, execute function and cache result
    const result = fn();
    this.set(key, result, ttl);
    return result;
  }

  // Cache with async function
  async cacheAsyncFunction<T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    // Check if data is in cache
    const cachedData = this.get<T>(key);
    if (cachedData !== null) {
      return cachedData;
    }

    // If not in cache, execute function and cache result
    try {
      const result = await fn();
      this.set(key, result, ttl);
      return result;
    } catch (error) {
      console.error('Error in cached async function:', error);
      throw error;
    }
  }

  // Invalidate cache by pattern
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));
  }

  // Invalidate cache by prefix
  invalidatePrefix(prefix: string): void {
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));
  }

  // Invalidate cache by suffix
  invalidateSuffix(suffix: string): void {
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (key.endsWith(suffix)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));
  }

  // Private methods
  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() - item.timestamp > item.ttl;
  }

  private evictItem(): void {
    if (this.cache.size === 0) return;

    let keyToEvict: string;

    switch (this.strategy) {
      case 'lru':
        keyToEvict = this.accessOrder[0]; // Least recently used
        break;
      case 'fifo':
        keyToEvict = this.accessOrder[0]; // First in, first out
        break;
      case 'ttl':
        // Find item with earliest expiration
        let earliestExpiration = Infinity;
        keyToEvict = '';
        this.cache.forEach((item, key) => {
          const expiration = item.timestamp + item.ttl;
          if (expiration < earliestExpiration) {
            earliestExpiration = expiration;
            keyToEvict = key;
          }
        });
        break;
      default:
        keyToEvict = this.cache.keys().next().value;
    }

    if (keyToEvict) {
      this.delete(keyToEvict);
    }
  }

  private updateAccessOrder(key: string): void {
    // Remove key from current position
    this.removeFromAccessOrder(key);
    // Add to end (most recently used)
    this.accessOrder.push(key);
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  private cleanupExpiredItems(): void {
    const keysToDelete: string[] = [];

    this.cache.forEach((item, key) => {
      if (this.isExpired(item)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));
  }
}



