import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
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
  AbstractControl,
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ContactFormService } from './service/contact-form.service';
import { TextOnlyValidators } from '../custom-validators/text-only.validator';
import { FeatureFlagService } from './service/feature-flag.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactFormData } from './contact-form.interface';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule,
  ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent implements OnInit {
  private static readonly ALLOWED_FILE_TYPES = [
    'application/step',
    'application/stp',
    'application/pdf',
    'image/jpeg',
    'image/png',
  ];

  private static readonly MAX_FILE_SIZE_MB = 10;
  private static readonly ERROR_MESSAGES: { [key: string]: string } = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    textOnly: 'Please enter text only (no numbers or special characters)',
    invalidPostalCode: 'Please enter a valid postal code',
    invalidPhone: 'Please enter a valid phone number',
    invalidCompanyName: 'Please enter a valid company name',
    invalidFileType: `Invalid file type. Only ${ContactFormComponent.ALLOWED_FILE_TYPES.join(', ')} allowed.`,
    fileSize: `File size must be less than ${ContactFormComponent.MAX_FILE_SIZE_MB}MB`,
  };

  public contactForm!: FormGroup;
  public fileValidationError = '';
  public isSubmitting = false;

  constructor(
    public readonly dialogRef: MatDialogRef<ContactFormComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly contactFormService: ContactFormService,
    public readonly featureFlagService: FeatureFlagService,
    private readonly destroyRef: DestroyRef,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.contactForm = this.formBuilder.group({
      firstName: ['', TextOnlyValidators.textOnly()],
      lastName: ['', [Validators.required, TextOnlyValidators.textOnly()]],
      email: ['', [Validators.required, Validators.email]],
      company: ['', [Validators.required, TextOnlyValidators.companyName()]],
      postalCode: ['', [Validators.required, TextOnlyValidators.postalCode()]],
      country: ['', [Validators.required, TextOnlyValidators.textOnly()]],
      telephone: ['', TextOnlyValidators.phoneNumber()],
      message: [''],
      agreement: [false, Validators.requiredTrue],
      file: [
        null,
        [this.validateFileType.bind(this), this.validateFileSize.bind(this)],
      ],
    });
  }

  public validateFileType(
    control: AbstractControl,
  ): { [key: string]: boolean } | null {
    const file = control.value;
    if (!file) return null;
    const isValidType = ContactFormComponent.ALLOWED_FILE_TYPES.includes(
      file.type,
    );
    return isValidType ? null : { invalidFileType: true };
  }

  public validateFileSize(
    control: AbstractControl,
  ): { [key: string]: boolean } | null {
    const file = control.value;
    if (!file) return null;
    const isValidSize =
      file.size <= ContactFormComponent.MAX_FILE_SIZE_MB * 1024 * 1024;
    return isValidSize ? null : { fileSize: true };
  }

  public handleFileSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.contactForm.patchValue({ file });
    this.contactForm.get('file')?.updateValueAndValidity();
  }

  public submitForm(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formData = this.contactForm.value as ContactFormData;

    this.contactFormService
      .submitContactForm(formData)
      .pipe(
        finalize(() => (this.isSubmitting = false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.handleSuccess(),
        error: (error) => this.handleError(error),
      });
  }

  public handleSuccess(): void {
    this.snackBar.open('Form submitted successfully!', 'Close', {
      duration: 3000,
    });
    this.dialogRef.close();
  }

  public handleError(error: Error): void {
    this.snackBar.open(`Submission failed: ${error.message}`, 'Close', {
      duration: 3000,
    });
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public getErrorMessage(controlName: string): string {
    const control = this.contactForm.get(controlName);
    if (!control?.errors) return '';
    const errorKey = Object.keys(control.errors)[0];
    return ContactFormComponent.ERROR_MESSAGES[errorKey] || 'Invalid input';
  }
}
