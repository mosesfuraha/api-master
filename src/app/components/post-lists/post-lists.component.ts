import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../../api/api-client/api-client.service';

@Component({
  selector: 'app-post-lists',
  templateUrl: './post-lists.component.html',
  styleUrls: ['./post-lists.component.css'],
})
export class PostListsComponent implements OnInit {
  posts: any[] = [];

  constructor(private apiClientService: ApiClientService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.apiClientService.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }

  viewPost(post: any): void {
    console.log('Viewing post:', post);
  }

  updatePost(post: any): void {
    console.log('Updating post:', post);
  }

  deletePost(postId: number): void {}
}
