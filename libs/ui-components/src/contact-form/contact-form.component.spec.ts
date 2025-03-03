import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ContactFormComponent } from './contact-form.component';
import { MatDialogRef } from '@angular/material/dialog';
import { ContactFormService } from './service/contact-form.service';
import { FeatureFlagService } from './service/feature-flag.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactFormData } from './contact-form.interface';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let dialogRef: MatDialogRef<ContactFormComponent>;
  let contactFormService: ContactFormService;

  const validFormData: ContactFormData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    company: 'Test Company Ltd',
    postalCode: '12345',
    country: 'United States',
    telephone: '+1-234-567-8900',
    message: 'Test message',
    agreement: true,
    file: null,
  };

  const mockFile = (name: string, type: string, size: number): File => {
    const file = new File([], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ContactFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jest.fn() } },
        {
          provide: ContactFormService,
          useValue: {
            submitContactForm: jest.fn(() => of(validFormData)),
          },
        },
        {
          provide: FeatureFlagService,
          useValue: { isFeatureEnabled: () => true },
        },
        {
          provide: MatSnackBar,
          useValue: { open: jest.fn() },
        },
        FormBuilder,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    contactFormService = TestBed.inject(ContactFormService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with correct controls and validators', () => {
      expect(component.contactForm.get('firstName')?.validator).toBeTruthy();
      expect(
        component.contactForm
          .get('lastName')
          ?.hasValidator(Validators.required),
      ).toBe(true);
      expect(
        component.contactForm.get('email')?.hasValidator(Validators.email),
      ).toBe(true);
      expect(
        component.contactForm.get('company')?.hasValidator(Validators.required),
      ).toBe(true);
      expect(
        component.contactForm
          .get('agreement')
          ?.hasValidator(Validators.requiredTrue),
      ).toBe(true);
    });
  });

  describe('Form Validations', () => {
    it('should validate postal code format', () => {
      const control = component.contactForm.get('postalCode');
      control?.setValue('1234');
      expect(control?.errors).toEqual({ invalidPostalCode: true });
      control?.setValue('12345');
      expect(control?.valid).toBeTruthy();
    });

    it('should validate phone number format', () => {
      const control = component.contactForm.get('telephone');
      control?.setValue('invalid');
      expect(control?.errors).toEqual({ invalidPhone: true });
      control?.setValue('+1-234-567-8900');
      expect(control?.valid).toBeTruthy();
    });

    it('should validate text-only fields', () => {
      const controls = ['firstName', 'lastName', 'country'];
      controls.forEach((controlName) => {
        const control = component.contactForm.get(controlName);
        control?.setValue('Invalid123');
        expect(control?.errors).toEqual({ textOnly: true });
        control?.setValue('Valid Name');
        expect(control?.valid).toBeTruthy();
      });
    });

    it('should validate company name format', () => {
      const control = component.contactForm.get('company');

      control?.setValue('Invalid Company!');
      expect(control?.errors).toEqual({ invalidCompanyName: true });

      control?.setValue('Valid Company Ltd');
      expect(control?.valid).toBeTruthy();

      control?.setValue('Company 123 Inc');
      expect(control?.valid).toBeTruthy();
    });

    it('should validate required fields', () => {
      const requiredControls = [
        'lastName',
        'email',
        'company',
        'postalCode',
        'country',
        'agreement',
      ];
      requiredControls.forEach((controlName) => {
        const control = component.contactForm.get(controlName);
        control?.setValue(null);
        expect(control?.hasError('required')).toBeTruthy();
      });
    });

    it('should validate form as a whole', () => {
      component.contactForm.setValue(validFormData);
      expect(component.contactForm.valid).toBeTruthy();
    });
  });

  describe('File Validation', () => {
    it('should validate file type', () => {
      const control = new FormControl();
      const invalidFile = mockFile('test.txt', 'text/plain', 1024);
      control.setValue(invalidFile);
      const result = component.validateFileType(control);
      expect(result).toEqual({ invalidFileType: true });

      const validFile = mockFile('test.pdf', 'application/pdf', 1024);
      control.setValue(validFile);
      expect(component.validateFileType(control)).toBeNull();
    });

    it('should validate file size', () => {
      const control = new FormControl();
      const oversizedFile = mockFile(
        'big.stp',
        'application/step',
        11 * 1024 * 1024,
      );
      control.setValue(oversizedFile);
      const result = component.validateFileSize(control);
      expect(result).toEqual({ fileSize: true });

      const validFile = mockFile(
        'valid.stp',
        'application/step',
        9 * 1024 * 1024,
      );
      control.setValue(validFile);
      expect(component.validateFileSize(control)).toBeNull();
    });

    it('should handle file selection', () => {
      const file = mockFile('test.jpg', 'image/jpeg', 1024);
      const event = { target: { files: [file] } } as unknown as Event;
      component.handleFileSelection(event);
      expect(component.contactForm.get('file')?.value).toEqual(file);
    });
  });

  describe('Form Submission', () => {
    it('should handle invalid form submission', () => {
      jest.spyOn(component.contactForm, 'markAllAsTouched');
      component.contactForm.setErrors({ invalid: true });
      component.submitForm();
      expect(component.contactForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should submit valid form', fakeAsync(() => {
      const completeFormData = {
        ...validFormData,
      };

      component.contactForm.setValue(completeFormData);
      component.contactForm.updateValueAndValidity();

      component.submitForm();

      expect(component.isSubmitting).toBe(false);
      expect(contactFormService.submitContactForm).toHaveBeenCalledWith(
        expect.objectContaining(validFormData),
      );

      tick();

      expect(dialogRef.close).toHaveBeenCalled();
      expect(component.isSubmitting).toBe(false);
    }));

    it('should handle submission error', fakeAsync(() => {
      const error = new Error('Test Error');
      jest
        .spyOn(contactFormService, 'submitContactForm')
        .mockReturnValue(throwError(() => error));
      component.contactForm.setValue(validFormData);
      component.submitForm();

      tick();

      expect(component.isSubmitting).toBe(false);
    }));
  });

  describe('Error Messages', () => {
    it('should get correct error messages for different errors', () => {
      const tests = [
        {
          control: 'email',
          error: 'required',
          message: 'This field is required',
        },
        {
          control: 'email',
          error: 'email',
          message: 'Please enter a valid email address',
        },
        {
          control: 'firstName',
          error: 'textOnly',
          message: 'Please enter text only (no numbers or special characters)',
        },
        {
          control: 'file',
          error: 'invalidFileType',
          message:
            'Invalid file type. Only application/step, application/stp, application/pdf, image/jpeg, image/png allowed.',
        },
        {
          control: 'file',
          error: 'fileSize',
          message: 'File size must be less than 10MB',
        },
      ];

      tests.forEach(({ control, error, message }) => {
        const formControl = component.contactForm.get(control);
        formControl?.setErrors({ [error]: true });
        formControl?.markAsTouched();
        expect(component.getErrorMessage(control)).toBe(message);
      });
    });
  });

  describe('UI Interactions', () => {
    it('should close dialog', () => {
      component.closeDialog();
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });
});
