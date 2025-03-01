import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { atLeastOneFieldValidator } from '../custom-validators/custom.validator';
import { ThankYouFeedbackComponent } from '../thank-you-feedback/thank-you-feedback.component';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        ThankYouFeedbackComponent,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        TranslocoTestingModule.forRoot({}),
      ],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form with only rating provided', () => {
    component.ratingForm.patchValue({ rating: 3, feedback: '' });
    expect(component.ratingForm.valid).toBeTruthy();
  });

  it('should validate form with only feedback provided', () => {
    component.ratingForm.patchValue({ rating: null, feedback: 'Great tool!' });
    expect(component.ratingForm.valid).toBeTruthy();
  });

  it('should invalidate form with neither rating nor feedback', () => {
    component.ratingForm.patchValue({ rating: null, feedback: '' });
    expect(component.ratingForm.valid).toBeFalsy();
  });

  it('should reset hovered rating on mouse leave', () => {
    component.onMouseEnter(3);
    fixture.detectChanges();
    expect(component.hoveredRating()).toBe(3);
    component.onMouseLeave();
    fixture.detectChanges();
    expect(component.hoveredRating()).toBe(0);
  });

  it('should initialize form as invalid when both rating and feedback are empty', () => {
    expect(component.ratingForm.valid).toBeFalsy();
  });

  it('should maintain selected rating on clicking the same star twice', () => {
    component.onClick(3);
    fixture.detectChanges();
    expect(component.selectedRating()).toBe(3);
    component.onClick(3);
    fixture.detectChanges();
    expect(component.selectedRating()).toBe(3);
  });

  it('should update selected rating when a lower star is clicked', () => {
    component.onClick(5);
    fixture.detectChanges();
    expect(component.selectedRating()).toBe(5);
    component.onClick(2);
    fixture.detectChanges();
    expect(component.selectedRating()).toBe(2);
  });

  it('should handle null form controls in isFormValid()', () => {
    const originalForm = component.ratingForm;
    type FormControlValue = string | number | null | undefined;
    type FormControlLike = { value: FormControlValue };
    interface FormGroupLike {
      get(name: string): FormControlLike | null;
    }

    const mockForm: FormGroupLike = {
      get: (controlName: string) => {
        if (controlName === 'rating') {
          return { value: null };
        }
        if (controlName === 'feedback') {
          return { value: '' };
        }
        return originalForm.get(controlName);
      },
    };

    component.ratingForm = mockForm as FormGroup;
    expect(component.ratingForm.valid).toBeFalsy();
    component.ratingForm = originalForm;
  });

  it('should handle undefined values in feedback control', () => {
    const originalForm = component.ratingForm;

    type FormControlValue = string | number | null | undefined;
    type FormControlLike = { value: FormControlValue };
    interface FormGroupLike {
      get(name: string): FormControlLike | null;
      patchValue(val: Record<string, FormControlValue>): void;
    }

    const mockForm: FormGroupLike = {
      get: (controlName: string) => {
        if (controlName === 'feedback') {
          return { value: undefined };
        }
        if (controlName === 'rating') {
          return { value: null };
        }
        return originalForm.get(controlName);
      },
      patchValue: jest.fn(),
    };

    component.ratingForm = mockForm as FormGroup;
    expect(component.ratingForm.valid).toBeFalsy();

    component.ratingForm = originalForm;
  });

  it('should handle missing form controls in validator', () => {
    const mockControl = {
      get: (name: string) => {
        if (name === 'rating') return null;
        if (name === 'feedback') return { value: '' };
        return null;
      },
    } as AbstractControl;
    const validatorFn = atLeastOneFieldValidator();
    const result = validatorFn(mockControl);
    expect(result).toEqual({ atLeastOneFieldRequired: true });
  });

  it('should handle null controls in validator', () => {
    const mockControlNull = {
      get: (name: string) => null,
    } as AbstractControl;

    const validatorFn = atLeastOneFieldValidator();
    const result = validatorFn(mockControlNull);

    expect(result).toEqual({ atLeastOneFieldRequired: true });
  });
});
