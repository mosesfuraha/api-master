import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CachingService } from './caching.service';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private url = 'https://jsonplaceholder.typicode.com/posts';
  private cacheKey = 'posts'; // Key for caching posts

  constructor(
    private http: HttpClient,
    private cachingService: CachingService
  ) {}

  getPosts(): Observable<any[]> {
    const cachedData = this.cachingService.getCache(this.cacheKey);
    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get<any[]>(this.url).pipe(
      map((posts) => posts.slice(0, 10)),
      tap((data) => this.cachingService.setCache(this.cacheKey, data))
    );
  }
}
