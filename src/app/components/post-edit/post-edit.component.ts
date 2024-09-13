/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/no-output-native */
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css'],
})
export class PostEditComponent implements OnInit {
  @Input() post: any;
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<any>(); // Emit the updated post
  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
      this.update.emit(updatedPost); // Emit updated post data
      this.close.emit();
    }
  }

  onCancel(): void {
    this.close.emit();
  }
}
