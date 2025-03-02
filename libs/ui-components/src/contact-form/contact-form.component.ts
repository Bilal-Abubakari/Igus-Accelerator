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
import { finalize } from 'rxjs';
import { ContactFormService } from './service/contact-form.service';
import { TextOnlyValidators } from '../custom-validators/text-only.validator';
import { FeatureFlagService } from './service/feature-flag.service';

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
  public isSubmitting = false;

  constructor(
    public readonly dialogRef: MatDialogRef<ContactFormComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly contactFormService: ContactFormService,
    public readonly featureFlagService: FeatureFlagService,
  ) {
    this.contactForm = this.initializeForm();
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      firstName: ['', TextOnlyValidators.textOnly()],
      lastName: ['', [Validators.required, TextOnlyValidators.textOnly()]],
      email: ['', [Validators.required, Validators.email]],
      company: ['', [Validators.required, TextOnlyValidators.companyName()]],
      postalCode: ['', [Validators.required, TextOnlyValidators.postalCode()]],
      country: ['', [Validators.required, TextOnlyValidators.textOnly()]],
      telephone: ['', [Validators.required, TextOnlyValidators.phoneNumber()]],
      message: [''],
      agreement: [false, Validators.requiredTrue],
      file: [null],
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

  public getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'This field is required';
    if (field.errors['email']) return 'Please enter a valid email address';
    if (field.errors['textOnly'])
      return 'Please enter text only (no numbers or special characters)';
    if (field.errors['invalidPostalCode'])
      return 'Please enter a valid postal code';
    if (field.errors['invalidPhone'])
      return 'Please enter a valid phone number';
    if (field.errors['invalidCompanyName'])
      return 'Please enter a valid company name';
    if (field.errors['invalidFileType'])
      return 'Invalid file type. Only PNG, JPEG, and PDF are allowed.';

    return 'Invalid input';
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

    this.isSubmitting = true;

    this.contactFormService
      .submitContactForm(this.contactForm.value)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          alert('Form submitted successfully!');
          this.dialogRef.close();
        },
        error: (error) => alert(error.message),
      });
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
