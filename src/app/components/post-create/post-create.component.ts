import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiClientService } from '../../api/api-client/api-client.service';
import { Post } from '../../models/post.interface';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClose = new EventEmitter<void>();
  @Output() createSuccess = new EventEmitter<Post>();
  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiClientService: ApiClientService
  ) {
    this.createForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      body: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  onSubmit(): void {
    if (this.createForm.valid) {
      const newPost: Post = this.createForm.value;
      this.apiClientService.createPost(newPost).subscribe({
        next: (createdPost) => {
          console.log('Post created successfully:', createdPost);
          this.createSuccess.emit(createdPost);
          this.createForm.reset();
          this.onClose.emit();
        },
        error: (error) => {
          console.error('Error creating post:', error);
        },
      });
    }
  }

  onCancel(): void {
    this.onClose.emit();
  }
}
