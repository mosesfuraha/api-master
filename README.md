# ApiMaster

ApiMaster is an Angular application for managing posts with CRUD operations, featuring environment-specific API configurations and robust error handling using Angular Material's `MatSnackBar`.

**Deployed Application:** [https://api-master-eta.vercel.app/](https://api-master-eta.vercel.app/)

## Table of Contents

1. [Project Setup](#project-setup)
2. [Development Server](#development-server)
3. [Environment Configuration](#environment-configuration)
4. [Error Handling](#error-handling)
5. [Code Scaffolding](#code-scaffolding)
6. [Building the Project](#building-the-project)
7. [Running Tests](#running-tests)
8. [Deployment](#deployment)
9. [Further Help](#further-help)

## Project Setup

This project was generated with Angular CLI version 18.2.0.

## Development Server

Run the development server with:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Environment Configuration

ApiMaster uses different configurations for development, staging, and production environments:

- Development: `src/environments/environment.ts`
- Production: `src/environments/environment.prod.ts`
- Staging: `src/environments/environment.staging.ts`

Example configuration (`environment.ts`):

```typescript
export const environment = {
  production: false,
  apiUrl: "https://jsonplaceholder.typicode.com", 
};
```

To build for a specific environment:

```bash
ng build --configuration=development
ng build --configuration=production
ng build --configuration=staging
```

## Error Handling

Error handling uses Angular Material's `MatSnackBar` for displaying user-friendly messages. The `ErrorHandlingService` intercepts errors and shows appropriate messages.

Example usage:

```typescript
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ErrorHandlingService {
  constructor(private snackBar: MatSnackBar) {}

  handleRequest<T>() {
    return catchError((error) => {
      this.snackBar.open("An unexpected error occurred. Please try again.", "Close", {
        duration: 3000,
        verticalPosition: "top",
        horizontalPosition: "right",
      });
      return throwError(() => error);
    });
  }
}
```

## Code Scaffolding

Generate a new component:

```bash
ng generate component component-name
```

You can also generate other Angular entities (directives, pipes, services, etc.).

## Building the Project

Build the project with:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Running Tests

Run unit tests:

```bash
npm test
```

## Deployment

The application is deployed and accessible at:

[https://api-master-eta.vercel.app/](https://api-master-eta.vercel.app/)

## Further Help

For more help on the Angular CLI:

```bash
ng help
```

Or visit the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
