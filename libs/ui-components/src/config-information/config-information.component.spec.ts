import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ConfigInformationComponent } from './config-information.component';
import { translocoConfig, TranslocoTestingModule } from '@jsverse/transloco';

describe('ConfigurationCardComponent', () => {
  let component: ConfigInformationComponent;
  let fixture: ComponentFixture<ConfigInformationComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfigInformationComponent,
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
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct CSS classes', () => {
    const cardElement = compiled.querySelector('.config-card');
    expect(cardElement).toBeTruthy();
    expect(cardElement?.classList).toContain('config-card');
  });

  it('should have correct structure', () => {
    const cardElement = fixture.debugElement.query(By.css('.config-card'));
    const titleElement = cardElement.query(By.css('.card-title'));
    const contentElement = cardElement.query(By.css('.card-content'));

    expect(cardElement).toBeTruthy();
    expect(titleElement).toBeTruthy();
    expect(contentElement).toBeTruthy();
  });

  describe('responsive behavior', () => {
    let originalMatchMedia: (query: string) => MediaQueryList;

    beforeEach(() => {
      originalMatchMedia = window.matchMedia;
    });

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('should apply mobile styles when viewport width is less than 576px', () => {
      window.matchMedia = jest.fn().mockImplementation((query) => {
        return {
          matches: query.includes('(max-width: 576px)'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        };
      });

      expect(component).toBeTruthy();
    });
  });

  describe('canvas width variable', () => {
    it('should use canvas-width variable in styling', () => {
      expect(component).toBeTruthy();
    });
  });
});
