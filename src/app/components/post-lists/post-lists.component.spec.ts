import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostListsComponent } from './post-lists.component';
import { ApiClientService } from '../../api/api-client/api-client.service';
import { of, throwError } from 'rxjs';
import { Post } from '../../models/post.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CachingService } from '../../api/api-client/caching.service';
import { ErrorHandlingService } from '../../api/api-client/error-handling.service';

describe('PostListsComponent', () => {
  let component: PostListsComponent;
  let fixture: ComponentFixture<PostListsComponent>;
  let apiClientServiceMock: jest.Mocked<ApiClientService>;

  const mockPosts: Post[] = [
    { id: 1, title: 'Test Post 1', body: 'Test Body 1', userId: 1 },
    { id: 2, title: 'Test Post 2', body: 'Test Body 2', userId: 2 },
  ];

  beforeEach(async () => {
    const httpClientMock = {} as HttpClient;
    const cachingServiceMock = {} as CachingService;
    const errorHandlingServiceMock = {} as ErrorHandlingService;

    apiClientServiceMock = new ApiClientService(
      httpClientMock,
      cachingServiceMock,
      errorHandlingServiceMock
    ) as jest.Mocked<ApiClientService>;

    apiClientServiceMock.getPosts = jest.fn();
    apiClientServiceMock.deletePostById = jest.fn();

    await TestBed.configureTestingModule({
      declarations: [PostListsComponent],
      providers: [
        { provide: ApiClientService, useValue: apiClientServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PostListsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load posts on init', () => {
      apiClientServiceMock.getPosts.mockReturnValue(of(mockPosts));
      fixture.detectChanges();

      expect(component.posts).toEqual(mockPosts);
      expect(component.errorOccurred).toBe(false);
    });

    it('should handle error when loading posts', () => {
      apiClientServiceMock.getPosts.mockReturnValue(
        throwError(() => new Error('Failed to load posts'))
      );
      fixture.detectChanges();

      expect(component.posts).toEqual([]);
      expect(component.errorOccurred).toBe(true);
    });
  });

  describe('openEditModal', () => {
    it('should open edit modal and set selectedPostId', () => {
      const post: Post = {
        id: 1,
        title: 'Test Post',
        body: 'Test Body',
        userId: 1,
      };
      component.openEditModal(post);

      expect(component.isEditModalOpen).toBe(true);
      expect(component.selectedPostId).toEqual(post);
    });
  });

  describe('confirmDelete', () => {
    it('should delete post and update list', () => {
      component.posts = [...mockPosts];

      apiClientServiceMock.deletePostById.mockReturnValue(of({} as Post));

      component.postIdToDelete = 1;
      component.confirmDelete();

      expect(apiClientServiceMock.deletePostById).toHaveBeenCalledWith(1);
      expect(component.posts.length).toBe(1);
      expect(component.posts[0].id).toBe(2);
      expect(component.isDeleteModalOpen).toBe(false);
    });

    it('should handle error when deleting post', () => {
      component.posts = [...mockPosts];
      apiClientServiceMock.deletePostById.mockReturnValue(
        throwError(() => new Error('Failed to delete post'))
      );

      component.postIdToDelete = 1;
      component.confirmDelete();

      expect(apiClientServiceMock.deletePostById).toHaveBeenCalledWith(1);
      expect(component.posts.length).toBe(2);
      expect(component.isDeleteModalOpen).toBe(false);
    });
  });

  describe('pagination', () => {
    it('should update paginatedPosts based on current page', () => {
      component.posts = [...mockPosts];
      component.itemsPerPage = 1;
      component.currentPage = 1;

      component.updatePaginatedPosts();
      expect(component.paginatedPosts.length).toBe(1);
      expect(component.paginatedPosts[0].id).toBe(1);

      component.currentPage = 2;
      component.updatePaginatedPosts();
      expect(component.paginatedPosts.length).toBe(1);
      expect(component.paginatedPosts[0].id).toBe(2);
    });
  });

  describe('onCreateSuccess', () => {
    it('should add a new post and close the create modal', () => {
      const newPost: Post = {
        id: 3,
        title: 'New Post',
        body: 'New Body',
        userId: 3,
      };

      component.onCreateSuccess(newPost);

      expect(component.posts.includes(newPost)).toBe(true);
      expect(component.isCreateModalOpen).toBe(false);
    });
  });
});
