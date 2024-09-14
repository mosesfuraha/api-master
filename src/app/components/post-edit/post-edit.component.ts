/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-output-native */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiClientService } from '../../api/api-client/api-client.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css'],
})
export class PostEditComponent implements OnInit {
  @Input() post: any;
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<any>();
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
    if (this.editForm.valid) {
      const updatedPost = { ...this.post, ...this.editForm.value };
      this.apiClientService
        .updatePostById(updatedPost.id, updatedPost)
        .subscribe({
          next: (response) => {
            console.log('Updated Post:', response);
            this.update.emit(response);
            this.close.emit();
            window.location.reload();
          },
          error: (error) => {
            console.error('Error updating post:', error);
          },
        });
    }
  }

  onCancel(): void {
    this.close.emit();
  }
}
