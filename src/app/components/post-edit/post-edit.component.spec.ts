import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { PostEditComponent } from './post-edit.component';
import { ApiClientService } from '../../api/api-client/api-client.service';
import { Post } from '../../models/post.interface';

describe('PostEditComponent', () => {
  let component: PostEditComponent;
  let fixture: ComponentFixture<PostEditComponent>;
  let apiClientService: jest.Mocked<ApiClientService>;

  const mockPost: Post = {
    id: 1,
    title: 'Test Title',
    body: 'Test Body',
    userId: 0
  };

  beforeEach(async () => {
    const apiClientServiceMock = {
      updatePostById: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PostEditComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ApiClientService, useValue: apiClientServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostEditComponent);
    component = fixture.componentInstance;
    apiClientService = TestBed.inject(
      ApiClientService
    ) as jest.Mocked<ApiClientService>;
    component.post = mockPost;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with post data', () => {
    expect(component.editForm.value).toEqual({
      title: mockPost.title,
      body: mockPost.body,
    });
  });

  it('should call updatePostById on form submit', () => {
    apiClientService.updatePostById.mockReturnValue(of(mockPost));
    component.onSubmit();
    expect(apiClientService.updatePostById).toHaveBeenCalledWith(
      mockPost.id,
      mockPost
    );
  });

  it('should emit update and onClose events on successful submit', () => {
    const updateEmitSpy = jest.spyOn(component.update, 'emit');
    const onCloseEmitSpy = jest.spyOn(component.onClose, 'emit');
    apiClientService.updatePostById.mockReturnValue(of(mockPost));

    component.onSubmit();

    expect(updateEmitSpy).toHaveBeenCalledWith(mockPost);
    expect(onCloseEmitSpy).toHaveBeenCalled();
  });

  it('should log an error on failed submit', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    apiClientService.updatePostById.mockReturnValue(throwError('Error'));

    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalledWith('Error updating post:', 'Error');
  });
});
