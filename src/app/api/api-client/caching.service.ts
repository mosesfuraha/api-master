/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  constructor() {}

   
  getCache(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  setCache(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  clearCache(): void {
    localStorage.clear();
  }

  removeCache(key: string): void {
    localStorage.removeItem(key);
  }
}
