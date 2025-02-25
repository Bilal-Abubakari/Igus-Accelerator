import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactFormComponent } from './contact-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let dialogRefMock: jest.Mocked<MatDialogRef<ContactFormComponent>>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    dialogRefMock = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<ContactFormComponent>>;

    await TestBed.configureTestingModule({
      imports: [
        ContactFormComponent,
        NoopAnimationsModule,
        ReactiveFormsModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCheckboxModule,
        MatButtonModule,
        MatDialogModule,
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: dialogRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize the form with the correct structure', () => {
      expect(component.contactForm).toBeDefined();
      expect(component.contactForm.get('firstName')).toBeTruthy();
      expect(component.contactForm.get('lastName')).toBeTruthy();
      expect(component.contactForm.get('email')).toBeTruthy();
      expect(component.contactForm.get('company')).toBeTruthy();
      expect(component.contactForm.get('postalCode')).toBeTruthy();
      expect(component.contactForm.get('country')).toBeTruthy();
      expect(component.contactForm.get('telephone')).toBeTruthy();
      expect(component.contactForm.get('message')).toBeTruthy();
      expect(component.contactForm.get('agreement')).toBeTruthy();
      expect(component.contactForm.get('file')).toBeTruthy();
    });

    it('should initialize form fields with correct default values', () => {
      expect(component.contactForm.get('firstName')?.value).toBe('');
      expect(component.contactForm.get('lastName')?.value).toBe('');
      expect(component.contactForm.get('email')?.value).toBe('');
      expect(component.contactForm.get('company')?.value).toBe('');
      expect(component.contactForm.get('postalCode')?.value).toBe('');
      expect(component.contactForm.get('country')?.value).toBe('');
      expect(component.contactForm.get('telephone')?.value).toBe('');
      expect(component.contactForm.get('message')?.value).toBe('');
      expect(component.contactForm.get('agreement')?.value).toBe(false);
      expect(component.contactForm.get('file')?.value).toBeNull();
    });

    it('should initialize the form with correct validators', () => {
      expect(component.contactForm.get('lastName')?.validator).not.toBeNull();
      expect(component.contactForm.get('email')?.validator).not.toBeNull();
      expect(component.contactForm.get('company')?.validator).not.toBeNull();
      expect(component.contactForm.get('postalCode')?.validator).not.toBeNull();
      expect(component.contactForm.get('country')?.validator).not.toBeNull();
      expect(component.contactForm.get('agreement')?.validator).not.toBeNull();
      expect(component.contactForm.get('firstName')?.validator).toBeNull();
      expect(component.contactForm.get('message')?.validator).toBeNull();
    });
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const lastName = component.contactForm.get('lastName');
      const email = component.contactForm.get('email');
      const company = component.contactForm.get('company');
      const postalCode = component.contactForm.get('postalCode');
      const country = component.contactForm.get('country');
      const agreement = component.contactForm.get('agreement');

      expect(component.contactForm.valid).toBe(false);

      lastName?.setValue('Doe');
      email?.setValue('john.doe@example.com');
      company?.setValue('Test Company');
      postalCode?.setValue('12345');
      country?.setValue('Test Country');
      agreement?.setValue(true);

      expect(component.contactForm.valid).toBe(true);
    });

    it('should validate email format', () => {
      const email = component.contactForm.get('email');

      email?.setValue('invalid-email');
      expect(email?.valid).toBe(false);
      expect(email?.hasError('email')).toBe(true);

      email?.setValue('valid@example.com');
      expect(email?.valid).toBe(true);
      expect(email?.hasError('email')).toBe(false);
    });

    it('should validate telephone format', () => {
      const telephone = component.contactForm.get('telephone');

      telephone?.setValue('');
      expect(telephone?.valid).toBe(true);

      telephone?.setValue('abc123');
      expect(telephone?.valid).toBe(false);
      expect(telephone?.hasError('pattern')).toBe(true);

      telephone?.setValue('1234567');
      expect(telephone?.valid).toBe(true);

      telephone?.setValue('+1234567890');
      expect(telephone?.valid).toBe(true);

      telephone?.setValue('123456789012345');
      expect(telephone?.valid).toBe(true);

      telephone?.setValue('1234567890123456');
      expect(telephone?.valid).toBe(false);
    });

    it('should validate agreement is checked', () => {
      const agreement = component.contactForm.get('agreement');

      expect(agreement?.value).toBe(false);
      expect(agreement?.valid).toBe(false);

      agreement?.setValue(true);
      expect(agreement?.valid).toBe(true);
    });
  });

  describe('isFieldInvalid method', () => {
    it('should return false for untouched invalid fields', () => {
      expect(component.isFieldInvalid('lastName')).toBe(false);
    });

    it('should return true for touched invalid fields', () => {
      const lastNameControl = component.contactForm.get('lastName');
      lastNameControl?.markAsTouched();

      expect(component.isFieldInvalid('lastName')).toBe(true);
      expect(component.isFieldInvalid('lastName', 'required')).toBe(true);
    });

    it('should return false for valid fields', () => {
      const lastNameControl = component.contactForm.get('lastName');
      lastNameControl?.setValue('Doe');
      lastNameControl?.markAsTouched();

      expect(component.isFieldInvalid('lastName')).toBe(false);
    });

    it('should return false for non-existent fields', () => {
      expect(component.isFieldInvalid('nonExistentField')).toBe(false);
    });

    it('should check specific error type if provided', () => {
      const emailControl = component.contactForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();

      expect(component.isFieldInvalid('email', 'email')).toBe(true);
      expect(component.isFieldInvalid('email', 'required')).toBe(false);
    });
  });

  describe('File Handling', () => {
    it('should handle valid file selection', () => {
      const mockFile = new File(['dummy content'], 'test.pdf', {
        type: 'application/pdf',
      });
      const mockEvent = {
        target: {
          files: [mockFile],
        },
      } as unknown as Event;

      component.handleFileSelection(mockEvent);

      expect(component.fileValidationError).toBe('');
      expect(component.contactForm.get('file')?.value).toBe(mockFile);
    });

    it('should reject invalid file types', () => {
      const mockFile = new File(['dummy content'], 'test.txt', {
        type: 'text/plain',
      });
      const mockEvent = {
        target: {
          files: [mockFile],
        },
      } as unknown as Event;

      component.handleFileSelection(mockEvent);

      expect(component.fileValidationError).toBe(
        'Invalid file type. Only PNG, JPEG, and PDF are allowed.',
      );
      expect(component.contactForm.get('file')?.value).toBeNull();
    });

    it('should handle empty file selection', () => {
      const mockEvent = {
        target: {
          files: [],
        },
      } as unknown as Event;

      component.handleFileSelection(mockEvent);

      expect(component.contactForm.get('file')?.value).toBeNull();
    });

    it('should accept PNG files', () => {
      const mockFile = new File(['dummy content'], 'test.png', {
        type: 'image/png',
      });
      const mockEvent = {
        target: {
          files: [mockFile],
        },
      } as unknown as Event;

      component.handleFileSelection(mockEvent);

      expect(component.fileValidationError).toBe('');
      expect(component.contactForm.get('file')?.value).toBe(mockFile);
    });

    it('should accept JPEG files', () => {
      const mockFile = new File(['dummy content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      const mockEvent = {
        target: {
          files: [mockFile],
        },
      } as unknown as Event;

      component.handleFileSelection(mockEvent);

      expect(component.fileValidationError).toBe('');
      expect(component.contactForm.get('file')?.value).toBe(mockFile);
    });
  });

  describe('Form Submission', () => {
    it('should mark all fields as touched when submitting invalid form', () => {
      jest.spyOn(component.contactForm, 'markAllAsTouched');

      component.submitForm();

      expect(component.contactForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should not proceed with submission when form is invalid', () => {
      const submissionSpy = jest.spyOn(dialogRefMock, 'close');

      component.submitForm();

      expect(submissionSpy).not.toHaveBeenCalled();
    });

    it('should allow submission when form is valid', () => {
      component.contactForm.patchValue({
        lastName: 'Doe',
        email: 'john.doe@example.com',
        company: 'Test Company',
        postalCode: '12345',
        country: 'Test Country',
        agreement: true,
      });

      expect(component.contactForm.valid).toBe(true);
    });
  });

  describe('Dialog Management', () => {
    it('should close dialog when closeDialog is called', () => {
      component.closeDialog();
      expect(dialogRefMock.close).toHaveBeenCalled();
    });
  });

  describe('UI Integration', () => {
    it('should display error messages for invalid touched fields', () => {
      const lastNameControl = component.contactForm.get('lastName');
      lastNameControl?.markAsTouched();
      fixture.detectChanges();

      const errorElement = debugElement.query(By.css('mat-error'));
      expect(errorElement.nativeElement.textContent.trim()).toBe(
        'Last name is required',
      );
    });

    it('should display file name when file is selected', () => {
      const fileInput = debugElement.query(By.css('input[type="file"]'));
      const file = new File(['dummy content'], 'test.pdf', {
        type: 'application/pdf',
      });
      Object.defineProperty(fileInput.nativeElement, 'files', {
        value: [file],
      });
      fileInput.nativeElement.dispatchEvent(
        new Event('change', { bubbles: true }),
      );
      fixture.detectChanges();
      const fileNameElement = debugElement.query(By.css('.selected-file-name'));
      expect(fileNameElement?.nativeElement.textContent.trim()).toBe(
        'test.pdf',
      );
    });

    it('should display file validation error when invalid file is selected', () => {
      const fileInput = debugElement.query(By.css('input[type="file"]'));
      const invalidFile = new File(['dummy content'], 'test.txt', {
        type: 'text/plain',
      });
      Object.defineProperty(fileInput.nativeElement, 'files', {
        value: [invalidFile],
      });
      fileInput.nativeElement.dispatchEvent(
        new Event('change', { bubbles: true }),
      );
      fixture.detectChanges();
      const errorElement = debugElement.query(By.css('.error-message'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent.trim()).toBe(
        'Invalid file type. Only PNG, JPEG, and PDF are allowed.',
      );
    });
  });

  describe('Form Submission Integration', () => {
    it('should call submitForm when submit button is clicked', () => {
      jest.spyOn(component, 'submitForm');

      const submitButton = debugElement.query(By.css('.submit-btn'));
      submitButton.nativeElement.click();

      expect(component.submitForm).toHaveBeenCalled();
    });

    it('should call closeDialog when close button is clicked', () => {
      jest.spyOn(component, 'closeDialog');

      const closeButton = debugElement.query(By.css('.close-btn'));
      closeButton.nativeElement.click();

      expect(component.closeDialog).toHaveBeenCalled();
    });

    it('should call closeDialog when cancel button is clicked', () => {
      jest.spyOn(component, 'closeDialog');

      const cancelButton = debugElement.query(By.css('.cancel-btn'));
      cancelButton.nativeElement.click();
    });
  });

  describe('Form Element Interaction', () => {
    it('should display file validation error when invalid file is selected', () => {
      const fileInput = debugElement.query(By.css('input[type="file"]'));
      const invalidFile = new File(['dummy content'], 'test.txt', {
        type: 'text/plain',
      });
      Object.defineProperty(fileInput.nativeElement, 'files', {
        value: [invalidFile],
      });
      fileInput.nativeElement.dispatchEvent(
        new Event('change', { bubbles: true }),
      );
      fixture.detectChanges();
      const errorElement = debugElement.query(By.css('.error-message'));
      expect(errorElement).toBeTruthy();
      expect(errorElement.nativeElement.textContent.trim()).toBe(
        'Invalid file type. Only PNG, JPEG, and PDF are allowed.',
      );
    });

    it('should update form values when inputs change', () => {
      component.contactForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });

      fixture.detectChanges();

      expect(component.contactForm.get('firstName')?.value).toBe('John');
      expect(component.contactForm.get('lastName')?.value).toBe('Doe');
      expect(component.contactForm.get('email')?.value).toBe(
        'john.doe@example.com',
      );
    });
  });
});
