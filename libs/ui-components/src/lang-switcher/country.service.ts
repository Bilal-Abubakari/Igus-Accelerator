import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country, RegionsData } from './interface';
import region from '../assets/country/country.json';
import { catchError, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  regionsData$: Observable<RegionsData>;

  constructor() {
    this.regionsData$ = of(region).pipe(
      catchError(() => of({} as RegionsData)),
      shareReplay(1),
    );
  }

  getAfricaMiddleEastIndiaCountries(): Observable<Country[]> {
    return this.regionsData$.pipe(
      map((data) => data.africaMiddleEastIndia || []),
    );
  }

  getAsiaPacificCountries(): Observable<Country[]> {
    return this.regionsData$.pipe(map((data) => data.asiaPacific || []));
  }

  getEuropeCountries(): Observable<Country[]> {
    return this.regionsData$.pipe(map((data) => data.europe || []));
  }
}
