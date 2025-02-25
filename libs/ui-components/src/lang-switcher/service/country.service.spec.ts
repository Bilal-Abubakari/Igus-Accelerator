import { TestBed } from '@angular/core/testing';
import { CountryService } from './country.service';
import { firstValueFrom, of } from 'rxjs';
import { Country, RegionsData } from '../interface/country.interface';

describe('CountryService', () => {
  let service: CountryService;
  const mockRegionsData: RegionsData = {
    africaMiddleEastIndia: [
      { name: 'Egypt', language: 'English', code: 'EG' },
      { name: 'South Africa', language: 'English', code: 'ZA' },
    ],
    asiaPacific: [
      { name: 'Australia', language: 'English', code: 'AU' },
      { name: 'Japan', language: 'Japanese', code: 'JP' },
    ],
    europe: [
      { name: 'Germany', language: 'Deutsch', code: 'DE' },
      { name: 'France', language: 'Français', code: 'FR' },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountryService],
    });

    service = TestBed.inject(CountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return Africa, Middle East, and India countries', async () => {
    service.regionsData$ = of(mockRegionsData);
    const countries = await firstValueFrom(
      service.getAfricaMiddleEastIndiaCountries(),
    );
    expect(countries).toHaveLength(2);
    expect(countries[0].name).toBe('Egypt');
    expect(countries[1].code).toBe('ZA');
  });

  it('should return Asia Pacific countries', async () => {
    service.regionsData$ = of(mockRegionsData);
    const countries = await firstValueFrom(service.getAsiaPacificCountries());
    expect(countries).toHaveLength(2);
    expect(countries[0].name).toBe('Australia');
    expect(countries[1].code).toBe('JP');
  });

  it('should return Europe countries', async () => {
    service.regionsData$ = of(mockRegionsData);
    const countries = await firstValueFrom(service.getEuropeCountries());
    expect(countries).toHaveLength(2);
    expect(countries[0].name).toBe('Germany');
    expect(countries[1].code).toBe('FR');
  });

  it('should return an empty array if region data is undefined', async () => {
    service.regionsData$ = of({} as RegionsData);

    let africanCountries: Country[] = [];
    africanCountries = await firstValueFrom(
      service.getAfricaMiddleEastIndiaCountries(),
    );
    const asiaCountries = await firstValueFrom(
      service.getAsiaPacificCountries(),
    );
    const europeCountries = await firstValueFrom(service.getEuropeCountries());

    expect(africanCountries).toHaveLength(0);
    expect(asiaCountries).toHaveLength(0);
    expect(europeCountries).toHaveLength(0);
  });

  it('should return an empty array if region data is null', async () => {
    service.regionsData$ = of({
      africaMiddleEastIndia: null,
      asiaPacific: null,
      europe: null,
    } as unknown as RegionsData);

    const africaCountries = await firstValueFrom(
      service.getAfricaMiddleEastIndiaCountries(),
    );
    const asiaCountries = await firstValueFrom(
      service.getAsiaPacificCountries(),
    );
    const europeCountries = await firstValueFrom(service.getEuropeCountries());

    expect(africaCountries).toHaveLength(0);
    expect(asiaCountries).toHaveLength(0);
    expect(europeCountries).toHaveLength(0);
  });

  it('should have the correct data structure', async () => {
    service.regionsData$ = of(mockRegionsData);
    const data = await firstValueFrom(service.regionsData$);
    expect(data).toBeDefined();
    expect(data.asiaPacific).toBeDefined();
    expect(data.africaMiddleEastIndia).toBeDefined();
    expect(data.europe).toBeDefined();
  });
});
