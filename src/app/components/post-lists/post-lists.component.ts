import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../../api/api-client/api-client.service';

@Component({
  selector: 'app-post-lists',
  templateUrl: './post-lists.component.html',
  styleUrls: ['./post-lists.component.css'],
})
export class PostListsComponent implements OnInit {
  posts: any[] = [];
  paginatedPosts: any[] = [];
  errorOccurred = false;
  itemsPerPage = 10;
  currentPage = 1;

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
}
