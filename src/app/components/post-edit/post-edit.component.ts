import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiClientService } from '../../api/api-client/api-client.service';
import { Post } from '../../models/post.interface';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css'],
})
export class PostEditComponent implements OnInit {
  @Input() post: Post | null = null;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClose = new EventEmitter<void>(); // Renamed to avoid conflicts
  @Output() update = new EventEmitter<Post>(); // Use Post interface
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiClientService: ApiClientService
  ) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      body: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    if (this.post) {
      this.editForm.patchValue({
        title: this.post.title,
        body: this.post.body,
      });
    }
  }

  onSubmit(): void {
    if (this.editForm.valid && this.post) {
      const updatedPost: Post = { ...this.post, ...this.editForm.value };
      this.apiClientService
        .updatePostById(updatedPost.id, updatedPost)
        .subscribe({
          next: (response) => {
            this.update.emit(response);
            this.onClose.emit();
            window.location.reload();
          },
          error: (error) => {
            console.error('Error updating post:', error);
          },
        });
    }
  }

  onCancel(): void {
    this.onClose.emit();
  }
}
