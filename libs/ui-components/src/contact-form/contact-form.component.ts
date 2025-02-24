import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent {
  constructor(private dialogRef: MatDialogRef<ContactFormComponent>) {}

  contactForm:FormGroup = inject(FormBuilder).group({
    firstName: [''],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    company: ['', Validators.required],
    postalCode: ['', Validators.required],
    country: ['', Validators.required],
    telephone: ['', Validators.pattern(/^\+?[0-9\s\-()]{7,15}$/)],
    message: [''],
    agreement: [false, Validators.requiredTrue],
    file: [null as File | null],
  });

  isFieldInvalid(fieldName: string, errorType?: string): boolean {
    const field = this.contactForm.get(fieldName);
    if (!field) return false;

    if (errorType) {
      return field.hasError(errorType) && (field.touched || field.dirty);
    }

    return field.invalid && (field.touched || field.dirty);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB');
        this.contactForm.patchValue({ file: null });
        return;
      }
      if (!['image/png', 'image/jpeg', 'application/pdf'].includes(file.type)) {
        alert('Invalid file type. Only PNG, JPEG, and PDF are allowed.');
        this.contactForm.patchValue({ file: null });
        return;
      }
      this.contactForm.patchValue({ file });
    }
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form Value:', this.contactForm.value);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }

  closeForm() {
    this.dialogRef.close();
  }
}
