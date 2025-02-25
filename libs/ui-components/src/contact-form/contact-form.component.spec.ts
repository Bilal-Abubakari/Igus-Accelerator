import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactFormComponent } from './contact-form.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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

    component.contactForm.get('telephone')?.setValue('+1234567890');
    expect(component.contactForm.get('telephone')?.valid).toBeTruthy();
  });

  it('should handle form submission when valid', () => {
    component.contactForm.patchValue({
      lastName: 'Doe',
      email: 'john.doe@example.com',
      company: 'ACME Corp',
      postalCode: '12345',
      country: 'United States',
      agreement: true,
    });

    const markAllAsTouchedSpy = jest.spyOn(component.contactForm, 'markAllAsTouched');
    component.submitForm();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should mark fields as touched when submitting invalid form', () => {
    const markAllAsTouchedSpy = jest.spyOn(component.contactForm, 'markAllAsTouched');
    component.submitForm();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should close the dialog', () => {
    const closeSpy = jest.spyOn(component, 'closeDialog');
    component.closeDialog();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should handle valid file selection', () => {
    const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const mockEvent = { target: { files: [mockFile] } } as unknown as Event;
    component.handleFileSelection(mockEvent);
    expect(component.contactForm.get('file')?.value).toBe(mockFile);
  });

  it('should handle invalid file selection', () => {
    const mockFile = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
    const mockEvent = { target: { files: [mockFile] } } as unknown as Event;
    component.handleFileSelection(mockEvent);
    expect(component.fileValidationError).toBe('Invalid file type. Only PNG, JPEG, and PDF are allowed.');
    expect(component.contactForm.get('file')?.value).toBeNull();
  });
});