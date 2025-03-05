import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { FooterService } from './footer.service';
import { FeedbackInterface } from '../footer.interface';
import { provideHttpClient } from '@angular/common/http';

describe('FooterService', () => {
  let service: FooterService;
  let httpMock: HttpTestingController;
  const BASE_API_URL = 'https://api.example.com/';
  const FEEDBACK_ID_KEY = 'feedback_id';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FooterService,
        { provide: 'BASE_API_URL', useValue: BASE_API_URL },
      ],
    });

    service = TestBed.inject(FooterService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send feedback via POST and store feedback_id', () => {
    const feedback: FeedbackInterface = { email: 'test@example.com' };
    const mockResponse = { id: '12345' };

    service.submitFeedback(feedback).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem(FEEDBACK_ID_KEY)).toBe('12345');
    });

    const req = httpMock.expectOne(`${BASE_API_URL}/user-feedback`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(feedback);
    req.flush(mockResponse);
  });

  it('should not store feedback_id if response does not contain an id', () => {
    const feedback: FeedbackInterface = { email: 'test@example.com' };
    const mockResponse = {};

    service.submitFeedback(feedback).subscribe();

    const req = httpMock.expectOne(`${BASE_API_URL}/user-feedback`);
    req.flush(mockResponse);

    expect(localStorage.getItem(FEEDBACK_ID_KEY)).toBeNull();
  });

  it('should send a PATCH request to update feedback', () => {
    const feedback: FeedbackInterface = { email: 'updated@example.com' };
    localStorage.setItem(FEEDBACK_ID_KEY, '12345');

    service.updateFeedback(feedback).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${BASE_API_URL}/user-feedback/12345`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(feedback);
    req.flush(null);
  });

  it('should fail to update feedback if no feedback_id is stored', () => {
    const feedback: FeedbackInterface = { email: 'updated@example.com' };

    service.updateFeedback(feedback).subscribe({
      error: (error) => {
        expect(error.message).toContain('404');
      },
    });

    const req = httpMock.expectOne(`${BASE_API_URL}/user-feedback/null`);
    expect(req.request.method).toBe('PATCH');
    req.flush('Feedback ID not found', {
      status: 404,
      statusText: 'Not Found',
    });
  });
});
