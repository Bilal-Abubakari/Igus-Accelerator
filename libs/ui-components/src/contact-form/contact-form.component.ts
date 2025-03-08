import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
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
import { ContactFormService } from './service/contact-form.service';
import { TextOnlyValidators } from '../validators/custom-validators/input-field.validator';
import { FeatureFlagService } from './service/feature-flag.service';
import { ContactFormData, Country } from './contact-form.interface';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CountryService } from './service/countries.service';
import { Subject, takeUntil } from 'rxjs';

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
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent implements OnInit, OnDestroy {
  private static readonly ALLOWED_FILE_TYPES = [
    'application/step',
    'application/stp',
    'application/pdf',
    'image/jpeg',
    'image/png',
  ];

  private static readonly MAX_FILE_SIZE_MB = 10;
  private destroy$ = new Subject<void>();

  public readonly errorMessages = {
    required: 'This field is required',
    textOnly: 'Invalid text format',
    email: 'Invalid email format',
    invalidPostalCode: 'Invalid postal code format',
    invalidPhone: 'Invalid phone number format',
    invalidCompanyName: 'Invalid company name format',
    invalidCountrySelection: 'Please select a country',
    invalidMessage: 'Invalid message format',
    requiredTrue: 'You must accept the data protection regulations',
    invalidFileType: 'Invalid file type',
    fileSize: `File size exceeds maximum of ${ContactFormComponent.MAX_FILE_SIZE_MB}MB`,
  };

  public contactForm!: FormGroup;
  public fileValidationError = '';
  public isSubmitting = false;
  public countries: Country[] = [];

  constructor(
    public readonly dialogRef: MatDialogRef<ContactFormComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly contactFormService: ContactFormService,
    private readonly countryService: CountryService,
    public readonly featureFlagService: FeatureFlagService,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCountries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCountries(): void {
    this.countryService.getCountries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (countries: Country[]) => {
          this.countries = countries;
        },
        error: () => {
          this.countries = [];
        },
      });
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
        [
          TextOnlyValidators.fileType(
            ContactFormComponent.ALLOWED_FILE_TYPES,
            ContactFormComponent.MAX_FILE_SIZE_MB,
          ),
        ],
      ],
    });
  }

  public get formControls(): { [key: string]: AbstractControl } {
    return this.contactForm.controls;
  }

  public hasError(controlName: string, errorName: string): boolean {
    return this.formControls[controlName].hasError(errorName);
  }

  public isTouched(controlName: string): boolean {
    return this.formControls[controlName].touched;
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
    const formData: ContactFormData = this.contactForm.getRawValue();

    this.contactFormService.submitContactForm(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.snackBar.open('Form submitted successfully!', 'Close', {
            duration: 3000,
          });
          this.dialogRef.close(true);
        },
        error: (error: Error) => {
          this.isSubmitting = false;
          this.snackBar.open(`Submission failed: ${error.message}`, 'Close', {
            duration: 5000,
          });
        },
      });
  }

  public deleteFile(): void {
    this.contactForm.patchValue({ file: null });
    this.contactForm.get('file')?.updateValueAndValidity();
    this.fileValidationError = '';
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }
}