import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ContactFormService } from './contact-form.service';
import { ContactFormData } from '../contact-form.interface';

describe('ContactFormService', () => {
  let service: ContactFormService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/contact-forms';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactFormService],
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

  it('should submit form data successfully', () => {
    const mockFormData: ContactFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      company: 'Example Inc.',
      postalCode: '12345',
      country: 'USA',
      telephone: '+1234567890',
      message: 'Hello!',
      agreement: true,
      file: new File(['test content'], 'test-file.pdf', {
        type: 'application/pdf',
      }),
    };

    service.submitContactForm(mockFormData).subscribe((response) => {
      expect(response).toEqual(mockFormData);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeInstanceOf(FormData);
    req.flush(mockFormData);
  });

  it('should transform ContactFormData into FormData correctly', () => {
    const mockData: ContactFormData = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      company: 'Tech Corp',
      postalCode: '54321',
      country: 'Canada',
      agreement: true,
      file: null,
    };

    service.submitContactForm(mockData).subscribe();
    const req = httpMock.expectOne(apiUrl);
    const formData = req.request.body as FormData;

    expect(formData.get('firstName')).toBe('Jane');
    expect(formData.get('lastName')).toBe('Smith');
    expect(formData.get('email')).toBe('jane.smith@example.com');
    expect(formData.get('company')).toBe('Tech Corp');
    expect(formData.get('postalCode')).toBe('54321');
    expect(formData.get('country')).toBe('Canada');
    expect(formData.get('agreement')).toBe('true');
    expect(formData.has('file')).toBe(false);
    req.flush(mockData);
  });

  it('should handle errors gracefully', () => {
    const mockData: ContactFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      company: 'TechCorp',
      postalCode: '12345',
      country: 'USA',
      telephone: '+1234567890',
      message: 'Hello, this is a test message.',
      agreement: true,
      file: new File(['test content'], 'test-file.pdf', {
        type: 'application/pdf',
      }),
    };

    service.submitContactForm(mockData).subscribe({
      next: () => fail('Expected an error, but got success response'),
      error: (error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Failed to submit form. Try again.');
      },
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush('Something went wrong', {
      status: 500,
      statusText: 'Server Error',
    });
  });
});
