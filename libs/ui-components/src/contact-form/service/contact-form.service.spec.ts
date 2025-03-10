import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { ContactFormService } from './contact-form.service';
import { ContactFormData } from '../contact-form.interface';

describe('ContactFormService', () => {
  let service: ContactFormService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://example.com/api';

  let mockContactFormData: ContactFormData;

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

    mockContactFormData = {
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
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const testFormSubmission = (
    formData: ContactFormData,
    additionalChecks?: (formDataEntries: Record<string, string | Blob>) => void,
  ) => {
    service.submitContactForm(formData).subscribe({
      next: (response) => {
        expect(response).toEqual(formData);
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/contact_forms`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTruthy();

    const formDataEntries: Record<string, string | Blob> = {};
    req.request.body.forEach((value: string | Blob, key: string): void => {
      formDataEntries[key] = value;
    });

    if (additionalChecks) {
      additionalChecks(formDataEntries);
    }

    req.flush(formData);
    return { req, formDataEntries };
  };

  it('should submit contact form successfully', () => {
    testFormSubmission(mockContactFormData, (formDataEntries) => {
      expect(formDataEntries['firstName']).toBe('John');
      expect(formDataEntries['email']).toBe('john@example.com');
    });
  });

  it('should handle form submission error', () => {
    service.submitContactForm(mockContactFormData).subscribe({
      error: (error) => {
        expect(error.message).toBe('Failed to submit form. Try again.');
      },
    });

    const req = httpMock.expectOne(`${baseUrl}/contact_forms`);
    req.error(new ErrorEvent('Network error'));
  });

  it('should only append non-null and non-undefined values to FormData', () => {
    const partialFormData: ContactFormData = {
      ...mockContactFormData,
      company: '',
      postalCode: '',
      country: '',
      telephone: undefined,
      agreement: false,
    };

    testFormSubmission(partialFormData, (formDataEntries) => {
      expect(Object.keys(formDataEntries)).toEqual([
        'firstName',
        'lastName',
        'email',
        'company',
        'postalCode',
        'country',
        'message',
        'agreement',
      ]);
      expect(formDataEntries['telephone']).toBeUndefined();
      expect(formDataEntries['file']).toBeUndefined();
    });
  });

  it('should append file to FormData if provided', () => {
    const mockFile = new File(['file content'], 'test.txt', {
      type: 'text/plain',
    });

    const formDataWithFile: ContactFormData = {
      ...mockContactFormData,
      file: mockFile,
    };

    testFormSubmission(formDataWithFile, (formDataEntries) => {
      const file = formDataEntries['file'] as File;
      expect(file.name).toBe(mockFile.name);
      expect(file.size).toBe(mockFile.size);
      expect(file.type).toBe(mockFile.type);
    });
  });

  it('should handle empty form data', () => {
    const emptyFormData: ContactFormData = {
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

    testFormSubmission(emptyFormData);
  });
});
