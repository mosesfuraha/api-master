/* eslint-disable @typescript-eslint/no-empty-function */
// api-interceptor.service.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req: HttpRequest<any>,
    next: HttpHandler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<HttpEvent<any>> {
    // Add a mock authentication token to the request headers
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer mock-auth-token`,
      },
    });

    // Log all HTTP requests and responses
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
