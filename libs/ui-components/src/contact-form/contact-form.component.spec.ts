import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactFormComponent } from './contact-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactFormComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form values', () => {
    expect(component.contactForm.value).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      postalCode: '',
      country: '',
      telephone: '',
      message: '',
      agreement: false,
      file: null,
    });
  });

  it('should validate required fields', () => {
    component.contactForm.patchValue({
      lastName: 'Doe',
      email: 'john.doe@example.com',
      company: 'ACME Corp',
      postalCode: '12345',
      country: 'United States',
      agreement: true,
    });
    expect(component.contactForm.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    component.contactForm.get('email')?.setValue('invalid-email');
    expect(component.contactForm.get('email')?.valid).toBeFalsy();

    component.contactForm.get('email')?.setValue('valid@example.com');
    expect(component.contactForm.get('email')?.valid).toBeTruthy();
  });

  it('should validate telephone format', () => {
    component.contactForm.get('telephone')?.setValue('abc');
    expect(component.contactForm.get('telephone')?.valid).toBeFalsy();

    component.contactForm.get('telephone')?.setValue('1234567890');
    expect(component.contactForm.get('telephone')?.valid).toBeTruthy();

    component.contactForm.get('telephone')?.setValue('+1-234-567-8901');
    expect(component.contactForm.get('telephone')?.valid).toBeTruthy();
  });

  it('should handle form submission when valid', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    component.contactForm.patchValue({
      lastName: 'Doe',
      email: 'john.doe@example.com',
      company: 'ACME Corp',
      postalCode: '12345',
      country: 'United States',
      agreement: true,
    });

    component.onSubmit();
    expect(consoleSpy).toHaveBeenCalledWith('Form Value:', expect.any(Object));
  });

  it('should mark fields as touched when submitting invalid form', () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.contactForm,
      'markAllAsTouched',
    );
    component.onSubmit();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should close the form', () => {
    component.closeForm();
    expect(component.isVisible).toBeFalsy();
  });

  it('should handle valid file selection', () => {
    const mockFile = new File(['test'], 'test.pdf', {
      type: 'application/pdf',
    });
    const mockEvent = { target: { files: [mockFile] } } as unknown as Event;
    component.onFileSelected(mockEvent);
    expect(component.contactForm.get('file')?.value).toBe(mockFile);
  });

  it('should handle empty file selection', () => {
    const mockEvent = { target: { files: [] } } as unknown as Event;
    component.onFileSelected(mockEvent);
    expect(component.contactForm.get('file')?.value).toBeNull();
  });

  it('should handle null files property', () => {
    const mockEvent = { target: { files: null } } as unknown as Event;
    component.onFileSelected(mockEvent);
    expect(component.contactForm.get('file')?.value).toBeNull();
  });

  it('should reject invalid file types', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const mockEvent = { target: { files: [mockFile] } } as unknown as Event;
    component.onFileSelected(mockEvent);
    expect(component.contactForm.get('file')?.value).toBeNull();
    expect(alertSpy).toHaveBeenCalledWith(
      'Invalid file type. Only PNG, JPEG, and PDF are allowed.',
    );
  });

  it('should reject files larger than 5MB', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
    const largeFile = new File(
      [new ArrayBuffer(6 * 1024 * 1024)],
      'large.pdf',
      { type: 'application/pdf' },
    );
    const mockEvent = { target: { files: [largeFile] } } as unknown as Event;
    component.onFileSelected(mockEvent);
    expect(component.contactForm.get('file')?.value).toBeNull();
    expect(alertSpy).toHaveBeenCalledWith('File size exceeds 5MB');
  });

  it('should correctly validate fields using isFieldInvalid', () => {
    component.contactForm.get('email')?.setValue('invalid');
    component.contactForm.get('email')?.markAsTouched();
    expect(component.isFieldInvalid('email', 'email')).toBeTruthy();

    component.contactForm.get('email')?.setValue('');
    expect(component.isFieldInvalid('email', 'required')).toBeTruthy();
  });

  it('should validate isFieldInvalid without errorType', () => {
    component.contactForm.get('email')?.setValue('invalid');
    component.contactForm.get('email')?.markAsTouched();
    expect(component.isFieldInvalid('email')).toBeTruthy();

    // Test with valid field
    component.contactForm.get('email')?.setValue('valid@example.com');
    expect(component.isFieldInvalid('email')).toBeFalsy();
  });

  it('should handle non-existent field in isFieldInvalid', () => {
    expect(component.isFieldInvalid('nonExistentField')).toBeFalsy();
  });

  it('should display error messages for invalid fields', () => {
    const lastNameInput = fixture.debugElement.query(
      By.css('input[formControlName="lastName"]'),
    );
    lastNameInput.nativeElement.dispatchEvent(new Event('focus'));
    lastNameInput.nativeElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('mat-error'));
    expect(errorElement).toBeTruthy();
  });
});
