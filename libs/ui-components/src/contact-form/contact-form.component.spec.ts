import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ContactFormComponent } from './contact-form.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ContactFormService } from './service/contact-form.service';
import { FeatureFlagService } from './service/feature-flag.service';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let mockDialogRef: Partial<MatDialogRef<ContactFormComponent>>;
  let mockContactFormService: Partial<ContactFormService>;
  let mockFeatureFlagService: Partial<FeatureFlagService>;

  beforeEach(async () => {
    mockDialogRef = {
      close: jest.fn(),
    };

    mockContactFormService = {
      submitContactForm: jest.fn(),
    };

    mockFeatureFlagService = {
      isFeatureEnabled: jest.fn().mockReturnValue(() => true),
    };

    await TestBed.configureTestingModule({
      imports: [
        ContactFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: ContactFormService, useValue: mockContactFormService },
        { provide: FeatureFlagService, useValue: mockFeatureFlagService },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    const controls = component.contactForm.controls;
    expect(controls['firstName']).toBeDefined();
    expect(controls['lastName']).toBeDefined();
    expect(controls['email']).toBeDefined();
    expect(controls['company']).toBeDefined();
    expect(controls['postalCode']).toBeDefined();
    expect(controls['country']).toBeDefined();
    expect(controls['telephone']).toBeDefined();
    expect(controls['message']).toBeDefined();
    expect(controls['agreement']).toBeDefined();
    expect(controls['file']).toBeDefined();
  });

  describe('isFieldInvalid', () => {
    it('should return false if the field does not exist', () => {
      expect(component.isFieldInvalid('nonexistent')).toBe(false);
    });
    it('should return false if field is valid', () => {
      const control = component.contactForm.get('lastName');
      control?.setErrors(null);
      control?.markAsUntouched();
      expect(component.isFieldInvalid('lastName')).toBe(false);
    });
    it('should return true if field is invalid and touched', () => {
      const control = component.contactForm.get('lastName');
      control?.setErrors({ required: true });
      control?.markAsTouched();
      expect(component.isFieldInvalid('lastName')).toBe(true);
    });
    it('should return true if field is invalid and dirty', () => {
      const control = component.contactForm.get('lastName');
      control?.setErrors({ required: true });
      control?.markAsDirty();
      expect(component.isFieldInvalid('lastName')).toBe(true);
    });
    it('should return true if errorType is specified and field has that error', () => {
      const control = component.contactForm.get('email');
      control?.setErrors({ email: true });
      control?.markAsTouched();
      expect(component.isFieldInvalid('email', 'email')).toBe(true);
    });
    it('should return false if errorType is specified but field does not have that error', () => {
      const control = component.contactForm.get('email');
      control?.setErrors({ required: true });
      control?.markAsTouched();
      expect(component.isFieldInvalid('email', 'email')).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    it('should return an empty string if the field does not exist or has no errors', () => {
      expect(component.getErrorMessage('nonexistent')).toBe('');
      const control = component.contactForm.get('email');
      control?.setErrors(null);
      expect(component.getErrorMessage('email')).toBe('');
    });
    it('should return "This field is required" for required error', () => {
      const control = component.contactForm.get('email');
      control?.setErrors({ required: true });
      expect(component.getErrorMessage('email')).toBe('This field is required');
    });
    it('should return "Please enter a valid email address" for email error', () => {
      const control = component.contactForm.get('email');
      control?.setErrors({ email: true });
      expect(component.getErrorMessage('email')).toBe(
        'Please enter a valid email address',
      );
    });
    it('should return text-only error message', () => {
      const control = component.contactForm.get('firstName');
      control?.setErrors({ textOnly: true });
      expect(component.getErrorMessage('firstName')).toBe(
        'Please enter text only (no numbers or special characters)',
      );
    });
    it('should return postal code error message', () => {
      const control = component.contactForm.get('postalCode');
      control?.setErrors({ invalidPostalCode: true });
      expect(component.getErrorMessage('postalCode')).toBe(
        'Please enter a valid postal code',
      );
    });
    it('should return phone number error message', () => {
      const control = component.contactForm.get('telephone');
      control?.setErrors({ invalidPhone: true });
      expect(component.getErrorMessage('telephone')).toBe(
        'Please enter a valid phone number',
      );
    });
    it('should return company name error message', () => {
      const control = component.contactForm.get('company');
      control?.setErrors({ invalidCompanyName: true });
      expect(component.getErrorMessage('company')).toBe(
        'Please enter a valid company name',
      );
    });
    it('should return file type error message', () => {
      const control = component.contactForm.get('file');
      control?.setErrors({ invalidFileType: true });
      expect(component.getErrorMessage('file')).toBe(
        'Invalid file type. Only PNG, JPEG, and PDF are allowed.',
      );
    });
    it('should return default invalid input message for unknown errors', () => {
      const control = component.contactForm.get('firstName');
      control?.setErrors({ unknown: true });
      expect(component.getErrorMessage('firstName')).toBe('Invalid input');
    });
  });

  describe('handleFileSelection', () => {
    const createFileEvent = (files: File[] | null): Event => {
      const inputElement = document.createElement('input');
      Object.defineProperty(inputElement, 'files', {
        value: files,
        writable: true,
      });
      return { target: inputElement } as unknown as Event;
    };

    it('should do nothing if no files are selected', () => {
      const event = createFileEvent(null);
      component.handleFileSelection(event);
      expect(component.fileValidationError).toBe('');
      expect(component.contactForm.get('file')?.value).toBeNull();
    });

    it('should set the file when a valid file is selected', () => {
      const validFile = new File(['content'], 'test.png', {
        type: 'image/png',
      });
      const event = createFileEvent([validFile]);
      component.handleFileSelection(event);
      expect(component.fileValidationError).toBe('');
      expect(component.contactForm.get('file')?.value).toEqual(validFile);
    });

    it('should set a validation error when an invalid file is selected', () => {
      const invalidFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });
      const event = createFileEvent([invalidFile]);
      component.handleFileSelection(event);
      expect(component.fileValidationError).toBe(
        'Invalid file type. Only PNG, JPEG, and PDF are allowed.',
      );
      expect(component.contactForm.get('file')?.value).toBeNull();
    });
  });

  describe('submitForm', () => {
    let alertSpy: jest.SpyInstance;

    beforeEach(() => {
      alertSpy = jest
        .spyOn(window, 'alert')
        .mockImplementation(() => undefined);
    });

    afterEach(() => {
      alertSpy.mockRestore();
    });

    it('should mark all fields as touched and not submit if the form is invalid', () => {
      const markAllAsTouchedSpy = jest.spyOn(
        component.contactForm,
        'markAllAsTouched',
      );
      component.contactForm.get('lastName')?.setErrors({ required: true });
      component.submitForm();
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
      expect(mockContactFormService.submitContactForm).not.toHaveBeenCalled();
    });

    it('should submit the form successfully', fakeAsync(() => {
      component.contactForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        company: 'TestCompany',
        postalCode: '12345',
        country: 'Testland',
        telephone: '1234567890',
        message: 'Hello',
        agreement: true,
      });
      expect(component.contactForm.valid).toBe(true);

      (mockContactFormService.submitContactForm as jest.Mock).mockReturnValue(
        of({}).pipe(delay(10)),
      );

      component.submitForm();
      expect(component.isSubmitting).toBe(true);
      tick(10);
      expect(window.alert).toHaveBeenCalledWith('Form submitted successfully!');
      expect(mockDialogRef.close).toHaveBeenCalled();
      expect(component.isSubmitting).toBe(false);
    }));

    it('should handle form submission errors', fakeAsync(() => {
      component.contactForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        company: 'TestCompany',
        postalCode: '12345',
        country: 'Testland',
        telephone: '1234567890',
        message: 'Hello',
        agreement: true,
      });
      expect(component.contactForm.valid).toBe(true);

      const errorResponse = { message: 'Submission failed' };
      (mockContactFormService.submitContactForm as jest.Mock).mockReturnValue(
        throwError(() => errorResponse).pipe(delay(10)),
      );

      component.submitForm();
      tick(10);
      expect(window.alert).toHaveBeenCalledWith('Submission failed');
      expect(component.isSubmitting).toBe(false);
    }));
  });

  describe('closeDialog', () => {
    it('should close the dialog', () => {
      component.closeDialog();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  });
});
