import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import {
  TranslocoService,
  TranslocoTestingModule,
  translocoConfig,
} from '@jsverse/transloco';
import { LanguageOverlayService } from '../../services/language-overlay/language-overlay.service';
import { LanguageOverlayComponent } from './language-overlay.component';

describe('LanguageOverlayComponent', () => {
  let component: LanguageOverlayComponent;
  let fixture: ComponentFixture<LanguageOverlayComponent>;
  let translocoService: TranslocoService;
  let languageOverlayService: LanguageOverlayService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        TranslocoTestingModule.forRoot({
          langs: {
            en: {
              languageSwitcher: {
                pageTitle: 'Select Language',
                close: 'Close',
              },
            },
            es: {
              languageSwitcher: {
                pageTitle: 'Seleccionar idioma',
                close: 'Cerrar',
              },
            },
          },
          translocoConfig: translocoConfig({
            availableLangs: ['en', 'es'],
            defaultLang: 'en',
          }),
        }),
      ],
      providers: [LanguageOverlayService],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageOverlayComponent);
    component = fixture.componentInstance;
    translocoService = TestBed.inject(TranslocoService);
    languageOverlayService = TestBed.inject(LanguageOverlayService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should not be visible if the LanguageOverlayService isOverlayVisible method returns false', () => {
    jest
      .spyOn(languageOverlayService, 'isOverlayVisible')
      .mockReturnValue(false);
    fixture.detectChanges();
    const overlayElement = fixture.debugElement.query(By.css('.overlay'));
    expect(overlayElement.classes).not.toContain('visible');
  });

  it('should call the LanguageOverlayServices overlayStateToggle method when a new language is selected', () => {
    jest.spyOn(languageOverlayService, 'overlayStateToggle');
    const langOption = fixture.debugElement.query(By.css('.lang-option'));
    langOption.triggerEventHandler('click', null);
    expect(languageOverlayService.overlayStateToggle).toHaveBeenCalled();
  });

  it("should call TranslocoService's setActiveLang with the selected language when a new language is selected", () => {
    jest.spyOn(translocoService, 'setActiveLang');
    const langOption = fixture.debugElement.query(By.css('.lang-option'));
    langOption.triggerEventHandler('click', null);
    expect(translocoService.setActiveLang).toHaveBeenCalledWith('en');
  });
});
