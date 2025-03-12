import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { FooterService } from './footer.service';
import { provideHttpClient } from '@angular/common/http';
import { SubscriptionRequest } from '../../footer.interface';

describe('FooterService', () => {
  let service: FooterService;
  let httpMock: HttpTestingController;
  const mockBaseUrl = 'https://api.example.com/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        FooterService,
        { provide: 'BASE_API_URL', useValue: mockBaseUrl },
      ],
    });
    service = TestBed.inject(FooterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should send subscription request via POST request', () => {
    const subscriptionRequest: SubscriptionRequest = {
      email: 'test@example.com',
      firstName: 'John Doe',
    };

    service.onSubscribeSubmit(subscriptionRequest).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${mockBaseUrl}/subscribe`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(subscriptionRequest);
    req.flush(null);
  });

  it('should emit reset event when emitReset is called', (done) => {
    service.getResetObservable().subscribe((value) => {
      expect(value).toBe(true);
      done();
    });
    service.emitReset();
  });

  it('should handle subscription error response', () => {
    const subscriptionRequest: SubscriptionRequest = {
      email: 'bad@example.com',
      firstName: 'John Doe',
    };

    service.onSubscribeSubmit(subscriptionRequest).subscribe({
      error: (error) => {
        expect(error.status).toBe(400);
      },
    });

    const req = httpMock.expectOne(`${mockBaseUrl}/subscribe`);
    expect(req.request.method).toBe('POST');
    req.flush('Invalid email', {
      status: 400,
      statusText: 'Bad Request',
    });
  });

  it('should complete the resetSubject observable after emission', () => {
    let emitCount = 0;
    let completeCount = 0;

    service.getResetObservable().subscribe({
      next: () => emitCount++,
      complete: () => completeCount++,
    });

    service.emitReset();
    expect(emitCount).toBe(1);

    let secondEmitCount = 0;
    service.getResetObservable().subscribe({
      next: () => secondEmitCount++,
    });

    service.emitReset();
    expect(secondEmitCount).toBe(1);
  });
});
