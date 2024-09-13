import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../../api/api-client/api-client.service';

@Component({
  selector: 'app-post-lists',
  templateUrl: './post-lists.component.html',
  styleUrls: ['./post-lists.component.css'],
})
export class PostListsComponent implements OnInit {
  posts: any[] = [];
  errorOccurred: boolean = false;

  constructor(private apiClientService: ApiClientService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.apiClientService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.errorOccurred = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.errorOccurred = true;
      },
    });
  }

  viewPost(post: any): void {
    console.log('Viewing post:', post);
  }

  updatePost(post: any): void {
    console.log('Updating post:', post);
  }

  deletePost(postId: number): void {
    console.log('Deleting post with ID:', postId);
  }
}
