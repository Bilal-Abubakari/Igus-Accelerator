import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { provideRouter } from '@angular/router';
import { TranslocoConfig, TranslocoTestingModule } from '@jsverse/transloco';
import { ModelLogoComponent } from '../../svgs/model-logo/model-logo.component';
import { LandingPageFooterComponent } from './landing-page-footer.component';

describe('LandingPageFooterComponent', () => {
  let component: LandingPageFooterComponent;
  let fixture: ComponentFixture<LandingPageFooterComponent>;

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
        LandingPageFooterComponent,
      ],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageFooterComponent);
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

  it('should display required error when firstName is touched and empty', () => {
    const firstNameControl = component.getField('firstName');
    firstNameControl.markAsTouched();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const errorElement = compiled.querySelector('mat-error');
    expect(errorElement?.textContent).toContain('This field is required');
  });

  it('should display invalid email error when email is invalid', () => {
    const emailControl = component.getField('email');
    emailControl.setValue('invalid-email');
    emailControl.markAsTouched();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const errorElement = compiled.querySelector('mat-error');
    expect(errorElement?.textContent).toContain(
      'landing-page-footer.ENTER_VALID_EMAILL',
    );
  });
});
