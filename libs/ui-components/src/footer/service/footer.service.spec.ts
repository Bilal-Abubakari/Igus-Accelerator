import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FooterService } from './footer.service';
import { FeedbackInterface } from '../footer.interface';

describe('FooterService', () => {
  let service: FooterService;
  let httpMock: HttpTestingController;
  const BASE_API_URL = 'http://localhost:3000';

  const mockFeedback: FeedbackInterface = {
    comment: 'Great experience!',
    rating: 5,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
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

  describe('submitFeedback', () => {
    it('should submit feedback and store feedback ID in localStorage', () => {
      const mockResponse = { id: '12345' };

      service.submitFeedback(mockFeedback).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('feedback_id')).toBe(mockResponse.id);
      });

      const req = httpMock.expectOne(`${BASE_API_URL}/user-feedback`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockFeedback);
      req.flush(mockResponse);
    });

    it('should not store feedback ID if response has no ID', () => {
      const mockResponse = {};

      service.submitFeedback(mockFeedback).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem('feedback_id')).toBeNull();
      });

      const req = httpMock.expectOne(`${BASE_API_URL}/user-feedback`);
      req.flush(mockResponse);
    });
  });

  describe('updateFeedback', () => {
    it('should update feedback if feedback ID exists in localStorage', () => {
      localStorage.setItem('feedback_id', '12345');

      service.updateFeedback(mockFeedback).subscribe();

      const req = httpMock.expectOne(`${BASE_API_URL}/user-feedback/12345`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(mockFeedback);
      req.flush(null);
    });

    it('should still make API call even if feedback ID is missing', () => {
      service.updateFeedback(mockFeedback).subscribe();

      const req = httpMock.expectOne(`${BASE_API_URL}/user-feedback/null`);
      expect(req.request.method).toBe('PATCH');
      req.flush(null);
    });
  });
});
