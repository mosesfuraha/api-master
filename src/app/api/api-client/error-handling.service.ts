import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: HttpErrorResponse) {
    let userFriendlyMessage = 'Something went wrong; please try again later.';

    if (error.error instanceof ErrorEvent) {
      userFriendlyMessage =
        'It seems there was a problem with your network connection. Please check your connection and try again.';
    } else {
      switch (error.status) {
        case 404:
          userFriendlyMessage = 'The requested resource was not found.';
          break;
        case 500:
          userFriendlyMessage =
            'The server encountered an error. Please try again later.';
          break;
        case 0:
          userFriendlyMessage =
            'It looks like you are offline. Please check your internet connection.';
          break;
        default:
          userFriendlyMessage =
            'An unexpected error occurred. Please try again.';
          break;
      }
    }

    this.snackBar.open(userFriendlyMessage, 'Close', {
      panelClass: ['error-snackbar'],
    });

    console.error('Technical error:', error);

    return throwError(() => new Error(userFriendlyMessage));
  }

  handleRequest<T>() {
    return (source: Observable<T>) =>
      source.pipe(
        retry(2),
        catchError((error) => this.handleError(error))
      );
  }
}
