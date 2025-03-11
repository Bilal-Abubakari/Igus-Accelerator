import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  Validators,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Observable, Subject, map } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { TextOnlyValidators } from '../validators/custom-validators/input-field.validator';
import { FeatureFlagService } from './service/feature-flag.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ContactFormActions } from './store/contact-form.actions';
import {
  selectIsSubmitting,
  selectIsSubmitted,
  selectError,
  selectCountries,
} from './store/contact-form.selectors';
import { ReusableButtonComponent } from '../reusable-components/reusable-button/reusable-button.component';
import { ReusableFormFieldComponent } from '../reusable-components/reusable-form-field/reusable-form-field.component';
import { SelectOption } from './contact-form.interface';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    ReusableFormFieldComponent,
    ReusableButtonComponent,
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

  public static readonly MAX_FILE_SIZE_MB = 10;
  public destroy$ = new Subject<void>();

  public readonly customErrorMessages = {
    fileSize: `File size exceeds maximum of ${ContactFormComponent.MAX_FILE_SIZE_MB}MB`,
  };

  public contactForm!: FormGroup;
  public fileValidationError = '';
  private readonly store = inject(Store);

  public isSubmitting$ = this.store.select(selectIsSubmitting);
  public isSubmitted$ = this.store.select(selectIsSubmitted);
  public error$ = this.store.select(selectError);
  public countries$ = this.store.select(selectCountries);

  public countryOptions$: Observable<SelectOption[]> = this.countries$.pipe(
    map((countries) => {
      if (!countries) return [];
      return countries.map((country) => ({
        value: country.code,
        label: country.name,
      }));
    }),
  );

  constructor(
    public readonly dialogRef: MatDialogRef<ContactFormComponent>,
    private readonly formBuilder: FormBuilder,
    public readonly featureFlagService: FeatureFlagService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.store.dispatch(ContactFormActions.loadCountries());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  public getFormControl(controlName: string): FormControl {
    const control = this.contactForm.get(controlName);
    if (!control) {
      throw new Error(`Control ${controlName} not found in form`);
    }
    return control as FormControl;
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

    this.store.dispatch(
      ContactFormActions.submitForm({
        formData: this.contactForm.getRawValue(),
      }),
    );

    this.isSubmitted$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSubmitted) => {
        if (isSubmitted) {
          this.dialogRef.close(true);
        }
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
