import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostListsComponent } from './components/post-lists/post-lists.component';
import { PostCreateComponent } from './components/post-create/post-create.component';
import { PostEditComponent } from './components/post-edit/post-edit.component';
import { PaginationComponent } from './pagination/pagination.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiInterceptorService } from './api/api-client/api-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    PostListsComponent,
    PostCreateComponent,
    PostEditComponent,
    PaginationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
