/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CachingService } from './caching.service';
import { ErrorHandlingService } from './error-handling.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private baseUrl = environment.apiUrl;
  private cacheKey = 'posts';

  constructor(
    private http: HttpClient,
    private cachingService: CachingService,
    private errorHandlingService: ErrorHandlingService
  ) {}

  getPostsFromCache(): any[] | null {
    return this.cachingService.getCache(this.cacheKey);
  }

  getPosts(): Observable<any[]> {
    const cachedData = this.getPostsFromCache();
    if (cachedData) {
      return of(cachedData);
    }

    return this.getRequest<any[]>('posts').pipe(
      tap((data) => this.cachingService.setCache(this.cacheKey, data)),
      this.errorHandlingService.handleRequest<any[]>()
    );
  }

  getPostById(id: number): Observable<any> {
    const cachedData = this.getPostsFromCache();
    if (cachedData) {
      const post = cachedData.find((item: any) => item.id === id);
      if (post) {
        return of(post);
      }
    }

    return this.getRequest<any>(`posts/${id}`).pipe(
      this.errorHandlingService.handleRequest<any>()
    );
  }

  updatePostById(id: number, updatedPost: any): Observable<any> {
    return this.putRequest<any>(`posts/${id}`, updatedPost).pipe(
      tap(() => {
        const cachedData = this.getPostsFromCache();
        if (cachedData) {
          const index = cachedData.findIndex((post: any) => post.id === id);
          if (index !== -1) {
            cachedData[index] = updatedPost;
            this.cachingService.setCache(this.cacheKey, cachedData);
          }
        }
      }),
      this.errorHandlingService.handleRequest<any>()
    );
  }

  deletePostById(id: number): Observable<any> {
    return this.deleteRequest<any>(`posts/${id}`).pipe(
      tap(() => {
        const cachedData = this.getPostsFromCache();
        if (cachedData) {
          const updatedCache = cachedData.filter((post: any) => post.id !== id);
          this.cachingService.setCache(this.cacheKey, updatedCache);
        }
      }),
      this.errorHandlingService.handleRequest<any>()
    );
  }

  getCommentsByPostId(postId: number): Observable<any[]> {
    return this.getRequest<any[]>(`comments?postId=${postId}`).pipe(
      this.errorHandlingService.handleRequest<any[]>()
    );
  }

  private getRequest<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  private putRequest<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  private deleteRequest<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }
}
