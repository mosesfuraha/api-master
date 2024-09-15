import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CachingService } from './caching.service';
import { ErrorHandlingService } from './error-handling.service';
import { environment } from '../../../environments/environment';
import { Post } from '../../models/post.interface';

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

  getPostsFromCache(): Post[] | null {
    return this.cachingService.getCache(this.cacheKey);
  }

  getPosts(): Observable<Post[]> {
    const cachedData = this.getPostsFromCache();
    if (cachedData) {
      return of(cachedData);
    }

    return this.getRequest<Post[]>('posts').pipe(
      tap((data) => this.cachingService.setCache(this.cacheKey, data)),
      this.errorHandlingService.handleRequest<Post[]>()
    );
  }

  getPostById(id: number): Observable<Post> {
    const cachedData = this.getPostsFromCache();
    if (cachedData) {
      const post = cachedData.find((item: Post) => item.id === id);
      if (post) {
        return of(post);
      }
    }

    return this.getRequest<Post>(`posts/${id}`).pipe(
      this.errorHandlingService.handleRequest<Post>()
    );
  }

  createPost(newPost: Post): Observable<Post> {
    return this.postRequest<Post>('posts', newPost).pipe(
      tap((createdPost) => {
        const cachedData = this.getPostsFromCache() || [];
        cachedData.push(createdPost);
        this.cachingService.setCache(this.cacheKey, cachedData);
      }),
      this.errorHandlingService.handleRequest<Post>()
    );
  }

  updatePostById(id: number, updatedPost: Post): Observable<Post> {
    return this.putRequest<Post>(`posts/${id}`, updatedPost).pipe(
      tap(() => {
        const cachedData = this.getPostsFromCache();
        if (cachedData) {
          const index = cachedData.findIndex((post: Post) => post.id === id);
          if (index !== -1) {
            cachedData[index] = updatedPost;
            this.cachingService.setCache(this.cacheKey, cachedData);
          }
        }
      }),
      this.errorHandlingService.handleRequest<Post>()
    );
  }

  deletePostById(id: number): Observable<Post> {
    return this.deleteRequest<Post>(`posts/${id}`).pipe(
      tap(() => {
        const cachedData = this.getPostsFromCache();
        if (cachedData) {
          const updatedCache = cachedData.filter(
            (post: Post) => post.id !== id
          );
          this.cachingService.setCache(this.cacheKey, updatedCache);
        }
      }),
      this.errorHandlingService.handleRequest<Post>()
    );
  }

  getCommentsByPostId(postId: number): Observable<Post[]> {
    return this.getRequest<Post[]>(`comments?postId=${postId}`).pipe(
      this.errorHandlingService.handleRequest<Post[]>()
    );
  }

  private getRequest<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  private putRequest<T>(endpoint: string, body: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body);
  }

  private deleteRequest<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`);
  }

  private postRequest<T>(endpoint: string, body: T): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body);
  }
}
