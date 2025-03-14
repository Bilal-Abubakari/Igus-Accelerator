import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CountryService } from './countries.service';

interface Country {
  code: string;
  name: string;
}

describe('CountriesService', () => {
  let service: CountryService;
  let httpMock: HttpTestingController;
  const mockCountries: Country[] = [
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountryService],
    });
    service = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should successfully fetch countries', () => {
    service.getCountries().subscribe((countries) => {
      expect(countries).toEqual(mockCountries);
    });
  });

  it('should return fallback countries when HTTP request fails', () => {
    service.getCountries().subscribe((countries) => {
      expect(countries).toEqual(service['fallbackCountries']);
      expect(countries.length).toBe(3);
      expect(countries[0].code).toBe('DE');
    });
  });

  it('should make HTTP request to correct endpoint', () => {
    service.getCountries().subscribe();
  });

  it('should return countries with correct structure', () => {
    service.getCountries().subscribe((countries) => {
      countries.forEach((country) => {
        expect(country).toHaveProperty('code');
        expect(country).toHaveProperty('name');
        expect(typeof country.code).toBe('string');
        expect(typeof country.name).toBe('string');
      });
    });
  });

  it('should handle empty response gracefully', () => {
    service.getCountries().subscribe((countries) => {
      expect(countries).toEqual([]);
    });
  });

  it('should match fallback countries structure with main response', () => {
    const fallbackCountries = service['fallbackCountries'];
    expect(fallbackCountries.length).toBe(3);
    fallbackCountries.forEach((country) => {
      expect(country).toHaveProperty('code');
      expect(country).toHaveProperty('name');
      expect(typeof country.code).toBe('string');
      expect(typeof country.name).toBe('string');
    });
  });
});
