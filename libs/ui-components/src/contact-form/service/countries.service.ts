import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Country } from '../contact-form.interface';
import CountryData from '../../assets/countries-api.json';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private readonly fallbackCountries: Country[] = [
    { code: 'DE', name: 'Germany' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
  ];

  private readonly countriesData: Observable<{ countries: Country[] }> =
    of(CountryData);

  public getCountries(): Observable<Country[]> {
    return this.countriesData.pipe(
      map((data) => data.countries),
      catchError(() => {
        return of(this.fallbackCountries);
      }),
    );
  }
}
