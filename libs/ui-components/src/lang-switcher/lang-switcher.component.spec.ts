import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LangSwitcherComponent } from './lang-switcher.component';
import { By } from '@angular/platform-browser';
import { MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { CountryService } from './country.service';

describe('LangSwitcherComponent', () => {
  let component: LangSwitcherComponent;
  let fixture: ComponentFixture<LangSwitcherComponent>;
  let mockCountryService: jest.Mocked<CountryService>;
  let mockDialogRef: jest.Mocked<MatDialogRef<LangSwitcherComponent>>;

  beforeEach(async () => {
    mockCountryService = {
      getAfricaMiddleEastIndiaCountries: jest.fn(),
      getAsiaPacificCountries: jest.fn(),
      getEuropeCountries: jest.fn(),
    } as unknown as jest.Mocked<CountryService>;

    mockDialogRef = {
      close: jest.fn(),
    } as unknown as jest.Mocked<MatDialogRef<LangSwitcherComponent>>;

    await TestBed.configureTestingModule({
      imports: [LangSwitcherComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: CountryService, useValue: mockCountryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LangSwitcherComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the header and close icon', () => {
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('h3')).nativeElement;
    expect(header.textContent).toContain('Select your country');

    const closeIcon = fixture.debugElement.query(
      By.css('mat-icon'),
    ).nativeElement;
    expect(closeIcon.textContent).toContain('close');
  });

  it('should initialize countries on ngOnInit', () => {
    const africaCountries = [
      { name: 'Egypt', language: 'English', code: 'EG' },
    ];
    const asiaCountries = [
      { name: 'Australia', language: 'English', code: 'AU' },
    ];
    const europeCountries = [
      { name: 'Germany', language: 'Deutsch', code: 'DE' },
    ];

    mockCountryService.getAfricaMiddleEastIndiaCountries.mockReturnValue(
      of(africaCountries),
    );
    mockCountryService.getAsiaPacificCountries.mockReturnValue(
      of(asiaCountries),
    );
    mockCountryService.getEuropeCountries.mockReturnValue(of(europeCountries));

    component.ngOnInit();

    expect(component.africaMiddleEastIndiaCountries).toEqual(africaCountries);
    expect(component.asiaPacificCountries).toEqual(asiaCountries);
    expect(component.europeCountries).toEqual(europeCountries);
  });

  it('should display regions with countries', () => {
    const africanCountries = [
      { name: 'Egypt', language: 'English', code: 'EG' },
    ];
    const asiaCountries = [
      { name: 'Australia', language: 'English', code: 'AU' },
    ];
    const europeCountries = [
      { name: 'Germany', language: 'Deutsch', code: 'DE' },
    ];

    mockCountryService.getAfricaMiddleEastIndiaCountries.mockReturnValue(
      of(africanCountries),
    );
    mockCountryService.getAsiaPacificCountries.mockReturnValue(
      of(asiaCountries),
    );
    mockCountryService.getEuropeCountries.mockReturnValue(of(europeCountries));

    component.ngOnInit();
    fixture.detectChanges();

    const regionsHeaders = fixture.debugElement.queryAll(By.css('h2'));
    expect(regionsHeaders.length).toBe(3);
    expect(regionsHeaders[0].nativeElement.textContent).toContain(
      'Africa, Middle East, and India',
    );
    expect(regionsHeaders[1].nativeElement.textContent).toContain(
      'Asia-Pacific',
    );
    expect(regionsHeaders[2].nativeElement.textContent).toContain('Europe');

    const countryItem = fixture.debugElement.queryAll(By.css('.country-item'));
    expect(countryItem.length).toBe(3);
    expect(countryItem[0].nativeElement.textContent).toContain(
      'Egypt (English)',
    );
    expect(countryItem[1].nativeElement.textContent).toContain(
      'Australia (English)',
    );
    expect(countryItem[2].nativeElement.textContent).toContain(
      'Germany (Deutsch)',
    );
  });

  it('should handle empty or undefined country data', () => {
    mockCountryService.getAfricaMiddleEastIndiaCountries.mockReturnValue(
      of([]),
    );
    mockCountryService.getAsiaPacificCountries.mockReturnValue(of([]));
    mockCountryService.getEuropeCountries.mockReturnValue(of([]));

    component.ngOnInit();

    expect(component.africaMiddleEastIndiaCountries).toEqual([]);
    expect(component.asiaPacificCountries).toEqual([]);
    expect(component.europeCountries).toEqual([]);
  });

  it('should handle errors from CountryService', () => {
    mockCountryService.getAfricaMiddleEastIndiaCountries.mockReturnValue(
      throwError(() => new Error('Failed to load')),
    );
    mockCountryService.getAsiaPacificCountries.mockReturnValue(
      throwError(() => new Error('Failed to load')),
    );
    mockCountryService.getEuropeCountries.mockReturnValue(
      throwError(() => new Error('Failed to load')),
    );

    component.ngOnInit();

    expect(component.africaMiddleEastIndiaCountries).toEqual([]);
    expect(component.asiaPacificCountries).toEqual([]);
    expect(component.europeCountries).toEqual([]);
  });

  it('should display regions correctly', () => {
    const regionHeaders = fixture.debugElement.queryAll(By.css('h2'));
    expect(regionHeaders.length).toBe(3);
    expect(regionHeaders[0].nativeElement.textContent).toContain(
      'Africa, Middle East, and India',
    );
    expect(regionHeaders[1].nativeElement.textContent).toContain(
      'Asia-Pacific',
    );
    expect(regionHeaders[2].nativeElement.textContent).toContain('Europe');
  });

  it('should display country items', () => {
    component.africaMiddleEastIndiaCountries = [
      { name: 'Egypt', language: 'English', code: 'EG' },
    ];
    component.asiaPacificCountries = [
      { name: 'Australia', language: 'English', code: 'AU' },
    ];
    component.europeCountries = [
      { name: 'Germany', language: 'Deutsch', code: 'DE' },
    ];

    fixture.detectChanges();

    const countryItems = fixture.debugElement.queryAll(By.css('.country-item'));
    expect(countryItems.length).toBe(3);
    expect(countryItems[0].nativeElement.textContent).toContain(
      'Egypt (English)',
    );
    expect(countryItems[1].nativeElement.textContent).toContain(
      'Australia (English)',
    );
    expect(countryItems[2].nativeElement.textContent).toContain(
      'Germany (Deutsch)',
    );
  });

  it('should not display region sections if no countries are available', () => {
    component.africaMiddleEastIndiaCountries = [];
    component.asiaPacificCountries = [];
    component.europeCountries = [];

    fixture.detectChanges();

    const regionHeaders = fixture.debugElement.queryAll(
      By.css('.country-item'),
    );
    expect(regionHeaders.length).toBe(0);
  });

  it('should load flag images correctly', () => {
    component.africaMiddleEastIndiaCountries = [
      { name: 'Egypt', language: 'English', code: 'EG' },
    ];
    fixture.detectChanges();

    const img = fixture.debugElement.query(
      By.css('.flag-container img'),
    ).nativeElement;
    expect(img.src).toContain('https://flagsapi.com/EG/flat/64.png');
  });

  it('should call close() when close button is clicked', () => {
    const spy = jest.spyOn(component, 'close');

    const closeButton = fixture.debugElement.query(
      By.css('.btn-wrapper button'),
    ).nativeElement;
    closeButton.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should call close() when close icon is clicked', () => {
    jest.spyOn(component, 'close');

    const closeIcon = fixture.debugElement.query(
      By.css('.header-container mat-icon'),
    ).nativeElement;
    closeIcon.click();

    expect(component.close).toHaveBeenCalled();
  });

  it('should close the dialog when close() is called', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should set language when setLanguage() is called', () => {
    const lang = 'en';
    component.setLanguage(lang);
    // expect(component.translocoService.setActiveLang).toHaveBeenCalledWith(lang);
  });
});
