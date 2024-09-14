/* eslint-disable @typescript-eslint/no-explicit-any */
// post-detail.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiClientService } from '../api/api-client/api-client.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit {
  @Input() postId!: number;
  post: any;
  comments: any[] = [];
  errorOccurred = false;

  constructor(
    private route: ActivatedRoute,
    private apiClientService: ApiClientService
  ) {}

  ngOnInit(): void {
    const postId =
      this.postId || Number(this.route.snapshot.paramMap.get('id'));
    this.fetchPostDetails(postId);
  }

  fetchPostDetails(postId: number): void {
    const cachedPosts = localStorage.getItem('posts');
    if (cachedPosts) {
      const posts = JSON.parse(cachedPosts);
      const post = posts.find((item: any) => item.id === postId);
      if (post) {
        this.post = post;
        this.fetchComments(postId);
        return;
      }
    }

    this.apiClientService.getPostById(postId).subscribe({
      next: (data) => {
        this.post = data;
        this.fetchComments(postId);
        this.updatePostCache(data);
      },
      error: (error) => {
        console.error('Error fetching post:', error);
        this.errorOccurred = true;
      },
    });
  }

  fetchComments(postId: number): void {
    const cachedComments = localStorage.getItem(`comments_${postId}`);
    if (cachedComments) {
      this.comments = JSON.parse(cachedComments);
      return;
    }

    this.apiClientService.getCommentsByPostId(postId).subscribe({
      next: (data) => {
        this.comments = data;
        this.updateCommentsCache(postId, data);
      },
      error: (error) => {
        console.error('Error fetching comments:', error);
        this.errorOccurred = true;
      },
    });
  }

  updatePostCache(post: any): void {
    const cachedPosts = localStorage.getItem('posts');
    const posts = cachedPosts ? JSON.parse(cachedPosts) : [];
    const index = posts.findIndex((item: any) => item.id === post.id);
    if (index !== -1) {
      posts[index] = post;
    } else {
      posts.push(post);
    }
    localStorage.setItem('posts', JSON.stringify(posts));
  }

  updateCommentsCache(postId: number, comments: any[]): void {
    localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
  }
}
