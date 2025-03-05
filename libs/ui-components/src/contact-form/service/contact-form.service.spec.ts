import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { ContactFormService } from './contact-form.service';
import { ContactFormData } from '../contact-form.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('ContactFormService', () => {
  let service: ContactFormService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://example.com/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ContactFormService,
        { provide: 'BASE_API_URL', useValue: baseUrl },
      ],
    });

    service = TestBed.inject(ContactFormService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should submit contact form successfully', () => {
    const mockContactFormData: ContactFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      company: 'Example Inc.',
      postalCode: '12345',
      country: 'USA',
      telephone: '1234567890',
      message: 'Test message',
      agreement: true,
      file: null,
    };

    service.submitContactForm(mockContactFormData).subscribe({
      next: (response) => {
        expect(response).toEqual(mockContactFormData);
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/contact_forms`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTruthy();

    const formDataEntries: Record<string, string | Blob> = {};
    req.request.body.forEach((value: string | Blob, key: string): void => {
      formDataEntries[key] = value;
    });

    expect(formDataEntries['firstName']).toBe('John');
    expect(formDataEntries['email']).toBe('john@example.com');

    req.flush(mockContactFormData);
  });

  it('should handle form submission error', () => {
    const mockContactFormData: ContactFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      company: 'Example Inc.',
      postalCode: '12345',
      country: 'USA',
      telephone: '1234567890',
      message: 'Test message',
      agreement: true,
      file: null,
    };

    service.submitContactForm(mockContactFormData).subscribe({
      error: (error) => {
        expect(error.message).toBe('Failed to submit form. Try again.');
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/contact_forms`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should only append non-null and non-undefined values to FormData', () => {
    const mockContactFormData: ContactFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      company: '',
      postalCode: '',
      country: '',
      telephone: undefined,
      message: 'Test message',
      agreement: false,
      file: null,
    };

    service.submitContactForm(mockContactFormData).subscribe({
      next: (response) => {
        expect(response).toEqual(mockContactFormData);
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/contact_forms`);
    const formDataEntries: Record<string, string | Blob> = {};
    req.request.body.forEach((value: string | Blob, key: string): void => {
      formDataEntries[key] = value;
    });

    expect(Object.keys(formDataEntries)).toEqual(['firstName', 'lastName', 'email', 'company', 'postalCode', 'country', 'message', 'agreement']);
    expect(formDataEntries['telephone']).toBeUndefined();
    expect(formDataEntries['file']).toBeUndefined();

    req.flush(mockContactFormData);
  });

  it('should append file to FormData if provided', () => {
    const mockFile = new File(['file content'], 'test.txt', { type: 'text/plain' });
    const mockContactFormData: ContactFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      company: 'Example Inc.',
      postalCode: '12345',
      country: 'USA',
      telephone: '1234567890',
      message: 'Test message',
      agreement: true,
      file: mockFile,
    };

    service.submitContactForm(mockContactFormData).subscribe({
      next: (response) => {
        expect(response).toEqual(mockContactFormData);
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/contact_forms`);
    const formDataEntries: Record<string, string | Blob> = {};
    req.request.body.forEach((value: string | Blob, key: string): void => {
      formDataEntries[key] = value;
    });

    expect(formDataEntries['file']).toBe(mockFile);

    req.flush(mockContactFormData);
  });

  it('should handle empty form data', () => {
    const mockContactFormData: ContactFormData = {
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
    };

    service.submitContactForm(mockContactFormData).subscribe({
      next: (response) => {
        expect(response).toEqual(mockContactFormData);
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/contact_forms`);
    const formDataEntries: Record<string, string | Blob> = {};
    req.request.body.forEach((value: string | Blob, key: string): void => {
      formDataEntries[key] = value;
    });

    req.flush(mockContactFormData);
});
});
