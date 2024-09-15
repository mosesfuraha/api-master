import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../../api/api-client/api-client.service';
import { Post } from '../../models/post.interface';

@Component({
  selector: 'app-post-lists',
  templateUrl: './post-lists.component.html',
  styleUrls: ['./post-lists.component.css'],
})
export class PostListsComponent implements OnInit {
  posts: Post[] = [];
  paginatedPosts: Post[] = [];
  errorOccurred = false;
  itemsPerPage = 10;
  currentPage = 1;
  selectedPostId: Post | null = null;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  postIdToDelete: number | null = null;
  isCreateModalOpen = false;

  constructor(private apiClientService: ApiClientService) {}

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.apiClientService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.errorOccurred = false;
        this.updatePaginatedPosts();
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.errorOccurred = true;
      },
    });
  }

  updatePaginatedPosts(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPosts = this.posts.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedPosts();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPosts();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePaginatedPosts();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.posts.length / this.itemsPerPage);
  }

  openEditModal(post: Post): void {
    this.selectedPostId = post;
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedPostId = null;
  }

  openDeleteModal(postId: number): void {
    this.postIdToDelete = postId;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.postIdToDelete = null;
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }

  confirmDelete(): void {
    if (this.postIdToDelete !== null) {
      this.apiClientService.deletePostById(this.postIdToDelete).subscribe({
        next: () => {
          this.posts = this.posts.filter(
            (post) => post.id !== this.postIdToDelete
          );
          this.updatePaginatedPosts();
          this.closeDeleteModal();
        },
        error: (error) => {
          console.error('Error deleting post:', error);
          this.closeDeleteModal();
        },
      });
    }
  }

  onCreateSuccess(newPost: Post): void {
    this.posts.push(newPost);
    this.updatePaginatedPosts();
    this.closeCreateModal();
  }
}
