import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListsComponent } from './components/post-lists/post-lists.component';
import { PostCreateComponent } from './components/post-create/post-create.component';

const routes: Routes = [
  { path: '', component: PostListsComponent },
  { path: 'create', component: PostCreateComponent },
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
