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

  beforeEach(async () => {
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

  it('should display the active language label', () => {
    const labelElement = fixture.debugElement.query(
      By.css('.active-lang div'),
    ).nativeElement;
    expect(labelElement.textContent).toContain('en');
  });

  it('should toggle language overlay on click', () => {
    jest.spyOn(component, 'toggleLanguageOverlay');
    const languageSwitcherElement = fixture.debugElement.query(
      By.css('.language-switcher'),
    ).nativeElement;
    languageSwitcherElement.click();
    expect(component.toggleLanguageOverlay).toHaveBeenCalled();
  });
});
