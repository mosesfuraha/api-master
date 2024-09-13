import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 10;
  @Output() pageChange = new EventEmitter<number>();

  get displayedPages(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 3;

    if (this.currentPage <= maxVisiblePages) {
      // Display the first few pages
      for (let i = 1; i <= Math.min(maxVisiblePages, this.totalPages); i++) {
        pages.push(i);
      }
      if (this.totalPages > maxVisiblePages) {
        pages.push(-1); // Indicate more pages (ellipsis)
        pages.push(this.totalPages); // Show the last page
      }
    } else if (
      this.currentPage > maxVisiblePages &&
      this.currentPage < this.totalPages - 1
    ) {
      // Display pages around the current page
      pages.push(1); // First page
      pages.push(-1); // Ellipsis
      pages.push(this.currentPage - 1); // Previous page
      pages.push(this.currentPage); // Current page
      pages.push(this.currentPage + 1); // Next page
      if (this.currentPage + 1 < this.totalPages - 1) {
        pages.push(-1); // Ellipsis
      }
      pages.push(this.totalPages); // Last page
    } else {
      // Display the last few pages
      pages.push(1); // First page
      pages.push(-1); // Ellipsis
      for (
        let i = this.totalPages - (maxVisiblePages - 1);
        i <= this.totalPages;
        i++
      ) {
        pages.push(i);
      }
    }
    return pages;
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }
}
