import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  private cache: Map<string, any> = new Map();

  constructor() {}

  getCache(key: string): any {
    return this.cache.get(key) || null;
  }

  setCache(key: string, data: any): void {
    this.cache.set(key, data);
  }

  clearCache(): void {
    this.cache.clear();
  }
}
