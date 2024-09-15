import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Post } from '../../models/post.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<Post>,
    next: HttpHandler
  ): Observable<HttpEvent<Post>> {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer mock-auth-token`,
      },
    });

    return next.handle(modifiedReq).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            console.log('Response:', event);
          }
        },
        error: (error) => {
          console.error('Error:', error);
        },
        complete: () => {
          console.log('Request completed.');
        },
      })
    );
  }
}
