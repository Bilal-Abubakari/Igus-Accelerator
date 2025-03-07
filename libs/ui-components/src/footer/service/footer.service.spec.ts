import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { FooterService } from './footer.service';
import { provideHttpClient } from '@angular/common/http';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectFeedbackId } from '../store/footer.selectors';
import { FeedbackRequest, FeedbackInterface } from '../footer.interface';

describe('FooterService', () => {
  let service: FooterService;
  let httpMock: HttpTestingController;
  let store: MockStore;
  const BASE_API_URL = 'https://api.example.com/';
  const mockFeedbackId = '12345';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore({
          selectors: [{ selector: selectFeedbackId, value: mockFeedbackId }],
        }),
        FooterService,
        { provide: 'BASE_API_URL', useValue: BASE_API_URL },
      ],
    });

    service = TestBed.inject(FooterService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should send feedback via POST request', () => {
    const feedback: FeedbackRequest = { email: 'test@example.com' };
    const mockResponse: FeedbackInterface = { id: '12345' };

    service.submitFeedback(feedback).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${BASE_API_URL}/user-feedback`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(feedback);
    req.flush(mockResponse);
  });

  it('should send a PATCH request to update feedback using feedbackId from store', () => {
    const feedback: FeedbackRequest = { email: 'updated@example.com' };

    service.updateFeedback(feedback).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(
      `${BASE_API_URL}/user-feedback/${mockFeedbackId}`
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(feedback);
    req.flush(null);
  });

  it('should emit reset event when emitReset is called', (done) => {
    service.getResetObservable().subscribe((value) => {
      expect(value).toBe(true);
      done();
    });

    service.emitReset();
  });

  it('should handle case where feedback ID is missing', () => {
    store.overrideSelector(selectFeedbackId, null);
    store.refreshState();

    const feedback: FeedbackRequest = { email: 'updated@example.com' };

    service.updateFeedback(feedback).subscribe({
      error: (error) => {
        expect(error.status).toBe(404);
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
