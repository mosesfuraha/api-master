import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListsComponent } from './components/post-lists/post-lists.component';

const routes: Routes = [
  { path: '', component: PostListsComponent },
  {
    path: 'post-detail/:id',
    loadChildren: () =>
      import('./post-detail/post-detail.module').then(
        (m) => m.PostDetailModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
