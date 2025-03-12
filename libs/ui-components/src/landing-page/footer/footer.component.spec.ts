import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoConfig, TranslocoTestingModule } from '@jsverse/transloco';
import { provideRouter } from '@angular/router';
import { ModelLogoComponent } from '../../svgs/model-logo/model-logo.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatIconModule,
        TranslocoTestingModule.forRoot({
          langs: {
            en: {
              'landing-page-footer': {
                REQUIRED_FIELD: 'This field is required',
                ENTER_VALID_EMAIL: 'Please enter a valid email address',
              },
            },
          },
          translocoConfig: {
            availableLangs: ['en'],
            defaultLang: 'en',
            reRenderOnLangChange: true,
            prodMode: false,
          } as TranslocoConfig,
          preloadLangs: true,
        }),
        ModelLogoComponent,
        FooterComponent,
      ],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the current year', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('.footer-links__terms-and-condition p')
        ?.textContent,
    ).toContain(`${new Date().getFullYear()} IMDesigner`);
  });

  it('should have a subscription form with initial values', () => {
    const form = component.subscriptionForm;
    expect(form).toBeTruthy();
    expect(form.get('firstName')?.value).toBe('');
    expect(form.get('email')?.value).toBe('');
  });
});
