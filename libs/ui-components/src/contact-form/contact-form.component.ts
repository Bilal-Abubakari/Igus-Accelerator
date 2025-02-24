import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  private static readonly ALLOWED_FILE_TYPES: string[] = [
    'image/png',
    'image/jpeg',
    'application/pdf',
  ];

  public contactForm: FormGroup;
  public fileValidationError = '';

  constructor(
    private readonly dialogRef: MatDialogRef<ContactFormComponent>,
    private readonly formBuilder: FormBuilder,
  ) {
    this.contactForm = this.initializeForm();
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      firstName: [''],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      company: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      telephone: ['', Validators.pattern(/^[+]?\d{7,15}$/)],
      message: [''],
      agreement: [false, Validators.requiredTrue],
      file: [null as File | null],
    });
  }

  public isFieldInvalid(fieldName: string, errorType?: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field
      ? field.invalid &&
          (field.touched || field.dirty) &&
          (!errorType || field.hasError(errorType))
      : false;
  }

  public handleFileSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!ContactFormComponent.ALLOWED_FILE_TYPES.includes(file.type)) {
      this.fileValidationError =
        'Invalid file type. Only PNG, JPEG, and PDF are allowed.';
      this.contactForm.patchValue({ file: null });
      return;
    }

    this.fileValidationError = '';
    this.contactForm.patchValue({ file });
  }

  public submitForm(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
