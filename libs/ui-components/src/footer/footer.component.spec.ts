import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FooterComponent } from './footer.component';
import { FooterService } from './service/footer.service';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TranslocoTestingModule, translocoConfig } from '@jsverse/transloco';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { ThankYouFeedbackComponent } from './components/thank-you-feedback/thank-you-feedback.component';
import { atLeastOneFieldValidator } from '../validators/custom-validators/custom.validator';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let footerService: FooterService;
  let formBuilder: FormBuilder;

  const mockFooterService = {
    submitFeedback: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        TranslocoTestingModule.forRoot({
          langs: {},
          translocoConfig: translocoConfig({}),
        }),
        FooterComponent,
        ThankYouFeedbackComponent,
      ],
      providers: [
        provideAnimations(),
        { provide: FooterService, useValue: mockFooterService },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    footerService = TestBed.inject(FooterService);
    formBuilder = TestBed.inject(FormBuilder);

    mockFooterService.submitFeedback.mockReturnValue(of({ id: '123' }));

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates component and sets current year', () => {
    expect(component).toBeDefined();
    expect(component.currentYear).toBe(new Date().getFullYear());
  });

  it('updates hoveredRating on onMouseEnter and resets on onMouseLeave', () => {
    component.onMouseEnter(3);
    expect(component.hoveredRating()).toBe(3);

    component.onMouseLeave();
    expect(component.hoveredRating()).toBe(0);
  });

  it('sets selectedRating and patches form on onClick', () => {
    component.onClick(4);
    expect(component.selectedRating()).toBe(4);
    expect(component.ratingForm.get('rating')?.value).toBe(4);
  });

  it('returns correct form control with getField', () => {
    expect(component.getField('comment')).toBe(
      component.ratingForm.get('comment'),
    );
  });

  it('returns correct ratingFormValues', () => {
    component.ratingForm.patchValue({ rating: 2, comment: 'test comment' });
    expect(component.ratingFormValues).toEqual({
      rating: 2,
      comment: 'test comment',
    });
  });

  it('does not submit feedback if form is invalid', () => {
    component.ratingForm.patchValue({ rating: null, comment: '' });
    component.submitFeedback();

    expect(footerService.submitFeedback).not.toHaveBeenCalled();
    expect(component.isRatingLoading()).toBeFalsy();
    expect(component.isSubmitted()).toBeFalsy();
  });

  it('submits feedback successfully and resets form', () => {
    component.ratingForm.patchValue({
      rating: 5,
      comment: 'Excellent service',
    });
    component.submitFeedback();

    expect(footerService.submitFeedback).toHaveBeenCalledWith({
      rating: 5,
      comment: 'Excellent service',
    });
    expect(component.isSubmitted()).toBeTruthy();
    expect(component.ratingForm.get('rating')?.value).toBeNull();
    expect(component.ratingForm.get('comment')?.value).toBeNull();
    expect(component.selectedRating()).toBe(0);
    expect(component.isRatingLoading()).toBeFalsy();
  });

  it('shows loading spinner during delayed feedback submission', fakeAsync(() => {
    mockFooterService.submitFeedback.mockReturnValue(
      of({ id: '123' }).pipe(delay(100)),
    );

    component.ratingForm.patchValue({ rating: 4, comment: 'Loading test' });
    component.submitFeedback();

    expect(component.isRatingLoading()).toBeTruthy();

    tick(100);
    fixture.detectChanges();

    expect(component.isRatingLoading()).toBeFalsy();
  }));

  it('validates form correctly with custom validator', () => {
    component.ratingForm.patchValue({ rating: null, comment: '' });
    expect(component.ratingForm.valid).toBeFalsy();

    component.ratingForm.patchValue({ rating: 3, comment: '' });
    expect(component.ratingForm.valid).toBeTruthy();

    component.ratingForm.patchValue({ rating: null, comment: 'Some comment' });
    expect(component.ratingForm.valid).toBeTruthy();
  });

  it('disables submit button when form is invalid', () => {
    component.ratingForm.patchValue({ rating: null, comment: '' });
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(
      By.css('.submit-rating-button'),
    );
    expect(submitButton.nativeElement.disabled).toBeTruthy();
  });

  it('calls submitFeedback when submit button is clicked', () => {
    jest.spyOn(component, 'submitFeedback');
    component.ratingForm.patchValue({ rating: 5, comment: 'Great!' });
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(
      By.css('.submit-rating-button'),
    ).nativeElement;
    submitButton.click();

    expect(component.submitFeedback).toHaveBeenCalled();
  });

  it('handles submission error correctly', fakeAsync(() => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockFooterService.submitFeedback.mockReturnValue(
      throwError(() => new Error('Submission failed')),
    );
    component.ratingForm.patchValue({ rating: 4, comment: 'Error test' });
    component.submitFeedback();
    expect(component.isRatingLoading()).toBeFalsy();
    tick();
    fixture.detectChanges();
    expect(component.isRatingLoading()).toBeFalsy();
    expect(component.isSubmitted()).toBeFalsy();
    errorSpy.mockRestore();
  }));

  it('should handle form value retrieval with existing form controls', () => {
    component.ratingForm = formBuilder.group(
      {
        comment: new FormControl<string | null>('Test comment'),
        rating: new FormControl<number | null>(4, [
          Validators.min(1),
          Validators.max(5),
        ]),
      },
      { validators: atLeastOneFieldValidator(['rating', 'comment']) },
    );

    const formValues = component.ratingFormValues;

    expect(formValues).toEqual({
      rating: 4,
      comment: 'Test comment',
    });
  });

  it('should handle form value retrieval with null values', () => {
    component.ratingForm = formBuilder.group(
      {
        comment: new FormControl<string | null>(null),
        rating: new FormControl<number | null>(null, [
          Validators.min(1),
          Validators.max(5),
        ]),
      },
      { validators: atLeastOneFieldValidator(['rating', 'comment']) },
    );
    const formValues = component.ratingFormValues;

    expect(formValues).toEqual({
      rating: null,
      comment: null,
    });
  });

  it('displays thank you feedback component when submitted', () => {
    component.isSubmitted.set(true);
    fixture.detectChanges();

    const thankYou = fixture.debugElement.query(
      By.css('app-thank-you-feedback'),
    );
    expect(thankYou).toBeTruthy();
  });
});
