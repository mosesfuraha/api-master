import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CachingService } from './caching.service';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private url = 'https://jsonplaceholder.typicode.com/posts';
  private cacheKey = 'posts';

  constructor(
    private http: HttpClient,
    private cachingService: CachingService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  getPosts(): Observable<any[]> {
    const cachedData = this.cachingService.getCache(this.cacheKey);
    if (cachedData) {
      return of(cachedData);
    }

    return this.http.get<any[]>(this.url).pipe(
      tap((data) => this.cachingService.setCache(this.cacheKey, data)),
      this.errorHandlingService.handleRequest()
    );
  }
}
