import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Country } from '../contact-form.interface';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private readonly countriesEndpoint = 'assets/countries-data.json';

  private readonly fallbackCountries: Country[] = [
    { code: 'DE', name: 'Germany' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
  ];

  constructor(private readonly http: HttpClient) {}

  public getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.countriesEndpoint).pipe(
      catchError(() => {
        return of(this.fallbackCountries);
      }),
    );
  }
}
