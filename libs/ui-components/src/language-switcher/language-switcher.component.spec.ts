import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  translocoConfig,
  TranslocoService,
  TranslocoTestingModule,
} from '@jsverse/transloco';
import { LanguageOverlayService } from './services/language-overlay/language-overlay.service';
import { By } from '@angular/platform-browser';
import { DEFAULT_LANGUAGE } from './constants';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;
  let translocoService: TranslocoService;
  let languageOverlayService: LanguageOverlayService;

  beforeEach(async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'translocoLang') return 'en';
      return null;
    });

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MatIconModule,
        MatMenuModule,
        TranslocoTestingModule.forRoot({
          langs: {
            en: { languageSwitcher: { languageLabel: 'English' } },
            es: { languageSwitcher: { languageLabel: 'Spanish' } },
          },
          translocoConfig: translocoConfig({
            defaultLang: 'en',
          }),
        }),
      ],
      providers: [LanguageOverlayService],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    translocoService = TestBed.inject(TranslocoService);
    languageOverlayService = TestBed.inject(LanguageOverlayService);

    jest.spyOn(translocoService, 'setActiveLang').mockImplementation(jest.fn());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default language to "en" if the language is not included in AVAILABLE_LANGUAGE_CODES', () => {
    const unsupportedLang = 'twi';

    Object.defineProperty(navigator, 'languages', {
      value: [unsupportedLang],
      configurable: true,
    });

    component.ngOnInit();

    expect(translocoService.getActiveLang()).toBe(DEFAULT_LANGUAGE);
  });

  it('should read saved language from localStorage during initialization', () => {
    component.ngOnInit();
    expect(localStorage.getItem).toHaveBeenCalledWith('translocoLang');
  });

  it('should set active language from localStorage if valid', () => {
    // Reset for this test
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => 'es');

    // Re-initialize
    component.ngOnInit();

    expect(translocoService.setActiveLang).toHaveBeenCalledWith('es');
  });

  it('should display the active language label', () => {
    const labelElement = fixture.debugElement.query(
      By.css('.active-lang div'),
    ).nativeElement;
    expect(labelElement.textContent).toContain('en');
  });

  it('should toggle language overlay on click', () => {
    jest
      .spyOn(languageOverlayService, 'overlayStateToggle')
      .mockImplementation(jest.fn());
    jest.spyOn(component.langOverlayToggleEventEmitter, 'emit');

    const languageSwitcherElement = fixture.debugElement.query(
      By.css('.language-switcher'),
    ).nativeElement;
    languageSwitcherElement.click();

    expect(languageOverlayService.overlayStateToggle).toHaveBeenCalled();
    expect(component.langOverlayToggleEventEmitter.emit).toHaveBeenCalledWith(
      null,
    );
  });
});
