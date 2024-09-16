import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { PostCreateComponent } from './post-create.component';
import { ApiClientService } from '../../api/api-client/api-client.service';
import { Post } from '../../models/post.interface';

describe('PostCreateComponent', () => {
  let component: PostCreateComponent;
  let fixture: ComponentFixture<PostCreateComponent>;
  let apiClientService: jest.Mocked<ApiClientService>;

  const mockPost: Post = {
    id: 1,
    title: 'Test Title',
    body: 'Test Body',
    userId: 0,
  };

  beforeEach(async () => {
    const apiClientServiceMock = {
      createPost: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [PostCreateComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ApiClientService, useValue: apiClientServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PostCreateComponent);
    component = fixture.componentInstance;
    apiClientService = TestBed.inject(
      ApiClientService
    ) as jest.Mocked<ApiClientService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.createForm.value).toEqual({
      title: '',
      body: '',
    });
  });

  it('should call createPost on form submit', () => {
    apiClientService.createPost.mockReturnValue(of(mockPost));
    component.createForm.setValue({ title: 'New Title', body: 'New Body' });
    component.onSubmit();
    expect(apiClientService.createPost).toHaveBeenCalledWith({
      title: 'New Title',
      body: 'New Body',
    });
  });

  it('should emit createSuccess and onClose events on successful submit', () => {
    const createSuccessEmitSpy = jest.spyOn(component.createSuccess, 'emit');
    const onCloseEmitSpy = jest.spyOn(component.onClose, 'emit');
    apiClientService.createPost.mockReturnValue(of(mockPost));

    component.createForm.setValue({ title: 'New Title', body: 'New Body' });
    component.onSubmit();

    expect(createSuccessEmitSpy).toHaveBeenCalledWith(mockPost);
    expect(onCloseEmitSpy).toHaveBeenCalled();
  });

  it('should log an error on failed submit', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    apiClientService.createPost.mockReturnValue(throwError('Error'));

    component.createForm.setValue({ title: 'New Title', body: 'New Body' });
    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalledWith('Error creating post:', 'Error');
  });
});
