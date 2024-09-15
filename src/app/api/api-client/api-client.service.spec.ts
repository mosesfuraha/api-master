import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiClientService } from './api-client.service';
import { CachingService } from './caching.service';
import { ErrorHandlingService } from './error-handling.service';
import { Post } from '../../models/post.interface';

describe('ApiClientService', () => {
  let service: ApiClientService;
  let httpMock: HttpTestingController;
  let cachingServiceMock: jest.Mocked<CachingService>;
  let errorHandlingServiceMock: jest.Mocked<ErrorHandlingService>;

  const mockPosts: Post[] = [
    { id: 1, title: 'Test Post', body: 'Test Body', userId: 1 },
  ];

  beforeEach(() => {
    cachingServiceMock = {
      getCache: jest.fn(),
      setCache: jest.fn(),
      clearCache: jest.fn(),
      removeCache: jest.fn(),
    } as jest.Mocked<CachingService>;

    errorHandlingServiceMock = {
      handleRequest: jest.fn((obs$) => obs$),
    } as unknown as jest.Mocked<ErrorHandlingService>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiClientService,
        { provide: CachingService, useValue: cachingServiceMock },
        { provide: ErrorHandlingService, useValue: errorHandlingServiceMock },
      ],
    });

    service = TestBed.inject(ApiClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks(); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPosts', () => {
    it('should return cached posts if available', (done) => {
      cachingServiceMock.getCache.mockReturnValue(mockPosts);

      service.getPosts().subscribe((posts) => {
        expect(posts).toEqual(mockPosts);
        expect(cachingServiceMock.getCache).toHaveBeenCalledWith('posts');
        done();
      });
    });

    it('should fetch posts from API if not in cache', (done) => {
      cachingServiceMock.getCache.mockReturnValue(null);

      service.getPosts().subscribe((posts) => {
        expect(posts).toEqual(mockPosts);
        done();
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/posts`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts);
    });
  });

  describe('getPostById', () => {
    it('should return a cached post by id if available', (done) => {
      cachingServiceMock.getCache.mockReturnValue(mockPosts);

      service.getPostById(1).subscribe((post) => {
        expect(post).toEqual(mockPosts[0]);
        expect(cachingServiceMock.getCache).toHaveBeenCalledWith('posts');
        done();
      });
    });

    it('should fetch a post by id from API if not in cache', (done) => {
      cachingServiceMock.getCache.mockReturnValue(null);

      service.getPostById(1).subscribe((post) => {
        expect(post).toEqual(mockPosts[0]);
        done();
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/posts/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts[0]);
    });
  });

  describe('createPost', () => {
    it('should create a new post and update the cache', (done) => {
      cachingServiceMock.getCache.mockReturnValue(mockPosts);

      const newPost: Post = {
        id: 2,
        title: 'New Post',
        body: 'New Body',
        userId: 1,
      };

      service.createPost(newPost).subscribe((createdPost) => {
        expect(createdPost).toEqual(newPost);
        done();
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/posts`);
      expect(req.request.method).toBe('POST');
      req.flush(newPost);

      expect(cachingServiceMock.setCache).toHaveBeenCalledWith('posts', [
        ...mockPosts,
        newPost,
      ]);
    });
  });

  describe('updatePostById', () => {
    it('should update a post and refresh the cache', (done) => {
      cachingServiceMock.getCache.mockReturnValue(mockPosts);

      const updatedPost: Post = {
        id: 1,
        title: 'Updated Title',
        body: 'Updated Body',
        userId: 1,
      };

      service.updatePostById(1, updatedPost).subscribe((post) => {
        expect(post).toEqual(updatedPost);
        done();
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/posts/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedPost);

      expect(cachingServiceMock.setCache).toHaveBeenCalled();
    });
  });

  describe('deletePostById', () => {
    it('should delete a post and update the cache', (done) => {
      cachingServiceMock.getCache.mockReturnValue(mockPosts);

      service.deletePostById(1).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${service['baseUrl']}/posts/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      expect(cachingServiceMock.setCache).toHaveBeenCalled();
    });
  });
});
