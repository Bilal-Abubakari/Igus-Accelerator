import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import {
  translocoConfig,
  TranslocoService,
  TranslocoTestingModule,
} from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ReusableButtonComponent } from '../../reusable-components/reusable-button/reusable-button.component';
import { ReusableFormFieldComponent } from '../../reusable-components/reusable-form-field/reusable-form-field.component';
import { ModelLogoComponent } from '../../svgs/model-logo/model-logo.component';
import { FooterComponent } from './footer.component';
import { FooterService } from './service/footer/footer.service';
import { NewsletterActions } from './store/footer.actions';
import { provideMockStore } from '@ngrx/store/testing';
import { selectIsSubscriptionLoading } from './store/footer.selectors';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let store: Store;
  let translocoService: TranslocoService;
  let footerService: FooterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        ReactiveFormsModule,
        FormsModule,
        MatToolbarModule,
        MatInputModule,
        MatIconModule,
        RouterTestingModule,
        MatProgressSpinnerModule,
        ReusableFormFieldComponent,
        ReusableButtonComponent,
        ModelLogoComponent,
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
      providers: [
        FormBuilder,
        provideMockStore({
          selectors: [{ selector: selectIsSubscriptionLoading, value: false }],
        }),
        {
          provide: FooterService,
          useValue: {
            getResetObservable: jest.fn(() => of()),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    translocoService = TestBed.inject(TranslocoService);
    footerService = TestBed.inject(FooterService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the subscription form', () => {
    expect(component.subscriptionForm).toBeDefined();
    expect(component.subscriptionForm.get('firstName')).toBeDefined();
    expect(component.subscriptionForm.get('email')).toBeDefined();
  });

  it('should validate the firstName field', () => {
    const firstNameControl = component.subscriptionForm.get('firstName');
    firstNameControl?.setValue('');
    expect(firstNameControl?.valid).toBeFalsy();
    expect(firstNameControl?.errors?.['required']).toBeTruthy();

    firstNameControl?.setValue('A');
    expect(firstNameControl?.valid).toBeFalsy();
    expect(firstNameControl?.errors?.['minlength']).toBeTruthy();

    firstNameControl?.setValue('A'.repeat(51));
    expect(firstNameControl?.valid).toBeFalsy();
    expect(firstNameControl?.errors?.['maxlength']).toBeTruthy();

    firstNameControl?.setValue('John123');
    expect(firstNameControl?.valid).toBeFalsy();
    expect(firstNameControl?.errors?.['pattern']).toBeTruthy();

    firstNameControl?.setValue('John');
    expect(firstNameControl?.valid).toBeTruthy();
  });

  it('should validate the email field', () => {
    const emailControl = component.subscriptionForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.errors?.['required']).toBeTruthy();

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should dispatch NewsletterActions.subscribe when form is valid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.subscriptionForm.setValue({
      firstName: 'John',
      email: 'john@example.com',
    });
    component.onSubscribe();
    expect(dispatchSpy).toHaveBeenCalledWith(
      NewsletterActions.subscribe({
        subscriber: { firstName: 'John', email: 'john@example.com' },
      }),
    );
  });

  it('should not dispatch NewsletterActions.subscribe when form is invalid', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.subscriptionForm.setValue({ firstName: '', email: '' });
    component.onSubscribe();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should complete the destroyer subject on ngOnDestroy', () => {
    // Spy on the complete method of the destroyer subject
    const completeSpy = jest.spyOn(component['destroyer'], 'complete');
    const nextSpy = jest.spyOn(component['destroyer'], 'next');

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should get the correct error messages', () => {
    expect(component.errorMessages.required).toBe('en.footer.REQUIRED_FIELD');
    expect(component.errorMessages.pattern).toBe('en.footer.ENTER_VALID_NAME');
    expect(component.errorMessages.email).toBe('en.footer.ENTER_VALID_EMAIL');
    expect(component.errorMessages.minlength).toBe('en.footer.NAME_TOO_SHORT');
    expect(component.errorMessages.maxlength).toBe('en.footer.NAME_TOO_LONG');
  });

  it('should get the current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });

  it('should call getResetObservable on ngOnInit', () => {
    const getResetObservableSpy = jest.spyOn(
      footerService,
      'getResetObservable',
    );
    component.ngOnInit();
    expect(getResetObservableSpy).toHaveBeenCalled();
  });
});
