import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ContactFormComponent } from './contact-form.component';
import { Store } from '@ngrx/store';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { ContactFormActions } from './store/contact-form.actions';
import {
  selectIsSubmitting,
  selectIsSubmitted,
  selectError,
  selectCountries,
} from './store/contact-form.selectors';
import { ReusableButtonComponent } from '../reusable-components/reusable-button/reusable-button.component';
import { ReusableFormFieldComponent } from '../reusable-components/reusable-form-field/reusable-form-field.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeatureFlagService } from './service/feature-flag.service';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let mockStore: { dispatch: jest.Mock; select: jest.Mock };
  let mockDialogRef: { close: jest.Mock };
  let isSubmittedSubject: Subject<boolean>;

  beforeEach(async () => {
    isSubmittedSubject = new Subject<boolean>();
    mockStore = {
      dispatch: jest.fn(),
      select: jest.fn().mockImplementation((selector) => {
        if (selector === selectIsSubmitting) return of(false);
        if (selector === selectIsSubmitted)
          return isSubmittedSubject.asObservable();
        if (selector === selectError) return of(null);
        if (selector === selectCountries)
          return of([{ code: 'US', name: 'United States' }]);
        return of(null);
      }),
    };

    mockDialogRef = { close: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        MatCheckboxModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        ContactFormComponent,
        ReusableButtonComponent,
        ReusableFormFieldComponent,
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: FeatureFlagService,
          useValue: {
            isFeatureEnabled: jest.fn().mockReturnValue(true),
          },
        },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and load countries on ngOnInit', () => {
    component.ngOnInit();
    expect(component.contactForm).toBeDefined();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      ContactFormActions.loadCountries(),
    );
  });

  it('should mark all fields as touched when invalid form is submitted', () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.contactForm,
      'markAllAsTouched',
    );
    component.submitForm();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should dispatch submitForm action when valid', () => {
    component.contactForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      company: 'Company Inc',
      postalCode: '12345',
      country: 'US',
      telephone: '1234567890',
      agreement: true,
    });

    component.submitForm();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      ContactFormActions.submitForm({
        formData: component.contactForm.getRawValue(),
      }),
    );
  });

  it('should close dialog on successful submission', fakeAsync(() => {
    component.contactForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      company: 'Company Inc',
      postalCode: '12345',
      country: 'US',
      telephone: '1234567890',
      agreement: true,
    });

    component.submitForm();

    isSubmittedSubject.next(true);
    tick();

    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  }));

  it('should handle valid file upload', () => {
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    const event = { target: { files: [file] } } as unknown as Event;

    component.handleFileSelection(event);
    expect(component.contactForm.get('file')?.value).toEqual(file);
    expect(component.fileValidationError).toBe('');
  });

  it('should handle file deletion', () => {
    component.contactForm.get('file')?.setValue(new File([''], 'test.pdf'));
    component.deleteFile();
    expect(component.contactForm.get('file')?.value).toBeNull();
    expect(component.fileValidationError).toBe('');
  });

  it('should map countries to select options', (done) => {
    component.countryOptions$.subscribe((options) => {
      expect(options).toEqual([{ value: 'US', label: 'United States' }]);
      done();
    });
  });

  it('should return empty array for countryOptions$ when countries are null', (done) => {
    mockStore.select.mockImplementation((selector) => {
      if (selector === selectCountries) return of(null);
      return of(false);
    });

    const fixture = TestBed.createComponent(ContactFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.countryOptions$.subscribe((options) => {
      expect(options).toEqual([]);
      done();
    });
  });

  it('should clean up subscriptions on destroy', () => {
    const nextSpy = jest.spyOn(component.destroy$, 'next');
    const completeSpy = jest.spyOn(component.destroy$, 'complete');

    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    const controls = ['lastName', 'email', 'company', 'postalCode', 'country'];
    controls.forEach((controlName) => {
      const control = component.contactForm.get(controlName);
      control?.setValue('');
      expect(control?.hasError('required')).toBe(true);
    });
  });

  it('should validate email format', () => {
    const emailControl = component.contactForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);
  });

  it('should close dialog on cancel', () => {
    component.closeDialog();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should handle empty file selection', () => {
    const event = { target: { files: null } } as unknown as Event;
    component.handleFileSelection(event);
    expect(component.contactForm.get('file')?.value).toBeNull();
  });

  it('should validate firstName for text only', () => {
    const firstNameControl = component.contactForm.get('firstName');
    firstNameControl?.setValue('John123');
    expect(firstNameControl?.errors?.['textOnly']).toBeTruthy();

    firstNameControl?.setValue('John');
    expect(firstNameControl?.errors).toBeNull();
  });

  it('should validate postal code format', () => {
    const postalCodeControl = component.contactForm.get('postalCode');
    postalCodeControl?.setValue('1234');
    expect(postalCodeControl?.errors?.['invalidPostalCode']).toBeTruthy();

    postalCodeControl?.setValue('12345');
    expect(postalCodeControl?.errors).toBeNull();
  });

  it('should validate company name format', () => {
    const companyControl = component.contactForm.get('company');
    companyControl?.setValue('Company@');
    expect(companyControl?.errors?.['invalidCompanyName']).toBeTruthy();

    companyControl?.setValue('Company Inc');
    expect(companyControl?.errors).toBeNull();
  });

  it('should validate telephone number format', () => {
    const telephoneControl = component.contactForm.get('telephone');

    telephoneControl?.setValue('123-abc');
    telephoneControl?.markAsTouched();
    fixture.detectChanges();
    expect(telephoneControl?.hasError('invalidPhone')).toBe(true);

    telephoneControl?.setValue('+491234567890');
    telephoneControl?.markAsTouched();
    fixture.detectChanges();
    expect(telephoneControl?.errors).toBeNull();
  });

  [
    'application/step',
    'application/stp',
    'application/pdf',
    'image/jpeg',
    'image/png',
  ].forEach((type) => {
    it(`should accept file type ${type}`, () => {
      const file = new File([''], `test.${type.split('/')[1]}`, { type });
      const event = { target: { files: [file] } } as unknown as Event;
      component.handleFileSelection(event);
      expect(component.contactForm.get('file')?.errors).toBeNull();
    });
  });

  it('should accept file size exactly 10MB', () => {
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', {
      value: ContactFormComponent.MAX_FILE_SIZE_MB * 1024 * 1024,
    });
    const event = { target: { files: [file] } } as unknown as Event;
    component.handleFileSelection(event);
    expect(component.contactForm.get('file')?.errors).toBeNull();
  });

  it('should not require message field', () => {
    const messageControl = component.contactForm.get('message');
    messageControl?.setValue('');
    expect(messageControl?.errors).toBeNull();
  });

  it('should validate country selection format', () => {
    const countryControl = component.contactForm.get('country');
    countryControl?.setValue('US1');
    expect(countryControl?.errors?.['textOnly']).toBeTruthy();

    countryControl?.setValue('US');
    expect(countryControl?.errors).toBeNull();
  });
});
