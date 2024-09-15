import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  getCache<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  setCache<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  clearCache(): void {
    localStorage.clear();
  }

  removeCache(key: string): void {
    localStorage.removeItem(key);
  }
}
