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

  it('should validate required fields', () => {
    const form = component.contactForm;
    expect(form.valid).toBeFalsy();
    
    form.patchValue({
      lastName: 'Doe',
      email: 'john.doe@example.com',
      company: 'ACME Corp',
      postalCode: '12345',
      country: 'United States',
      agreement: true
    });
    
    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.contactForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.hasError('email')).toBeTruthy();
    
    emailControl?.setValue('valid@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should handle form submission when valid', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    
    component.contactForm.patchValue({
      lastName: 'Doe',
      email: 'john.doe@example.com',
      company: 'ACME Corp',
      postalCode: '12345',
      country: 'United States',
      agreement: true
    });
    
    component.onSubmit();
    expect(consoleSpy).toHaveBeenCalledWith('Form Value:', expect.any(Object));
  });

  it('should mark fields as touched when submitting invalid form', () => {
    const markAllAsTouchedSpy = jest.spyOn(component.contactForm, 'markAllAsTouched');
    
    component.onSubmit();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it('should close the form', () => {
    expect(component.isVisible).toBeTruthy();
    
    component.closeForm();
    expect(component.isVisible).toBeFalsy();
  });

  it('should handle file selection', () => {
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    } as unknown as Event;
    
    component.onFileSelected(mockEvent);
    expect(component.contactForm.get('file')?.value).toBe(mockFile);
  });

  it('should correctly validate field with isFieldInvalid method', () => {
    const emailControl = component.contactForm.get('email');
    emailControl?.setValue('invalid');
    emailControl?.markAsTouched();
    
    expect(component.isFieldInvalid('email', 'email')).toBeTruthy();
    expect(component.isFieldInvalid('email', 'required')).toBeFalsy();
    
    emailControl?.setValue('');
    expect(component.isFieldInvalid('email', 'required')).toBeTruthy();
    expect(component.isFieldInvalid('email')).toBeTruthy();
  });

  it('should display error messages for invalid fields', () => {
    const lastNameInput = fixture.debugElement.query(By.css('input[formControlName="lastName"]'));
    lastNameInput.nativeElement.dispatchEvent(new Event('focus'));
    lastNameInput.nativeElement.dispatchEvent(new Event('blur'));
    
    fixture.detectChanges();
    
    const errorElement = fixture.debugElement.query(By.css('mat-error'));
    expect(errorElement).toBeTruthy();
  });
});