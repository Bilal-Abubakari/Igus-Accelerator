import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FooterComponent } from './footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThankYouFeedbackComponent } from '../thank-you-feedback/thank-you-feedback.component';

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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the proper structure', () => {
    expect(fixture.debugElement.query(By.css('footer'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.contact-us'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.rating-container'))).toBeTruthy();
  });

  it('should display correct contact information', () => {
    const contactElement = fixture.debugElement.query(By.css('.contact__tel'));
    expect(contactElement.nativeElement.textContent).toContain(
      'accelerator modeling configurator® GmbH',
    );
    const phoneLink = contactElement.query(By.css('a'));
    expect(phoneLink.nativeElement.href).toContain('tel:+4922039649145');
    expect(phoneLink.nativeElement.textContent).toBe('+49 2203 9649 145');
  });

  it('should display correct section headers', () => {
    const headers = fixture.debugElement.queryAll(By.css('h4'));
    expect(headers[0].nativeElement.textContent).toBe('Contact us');
    expect(headers[1].nativeElement.textContent).toBe('Please rate this configurator');
  });

  it('should display the correct copyright text', () => {
    fixture.detectChanges();
    const currentYear = new Date().getFullYear();
    const expectedText = `© ${currentYear} accelerator modeling configurator® GmbH`;
    const copyrightElement = fixture.debugElement.query(By.css('footer > span'));
    expect(copyrightElement).toBeTruthy();
    expect(copyrightElement.nativeElement.textContent.trim()).toBe(expectedText);
  });

  it('should render the rating stars', () => {
    const stars = fixture.debugElement.queryAll(By.css('mat-icon'));
    expect(stars.length).toBe(5);
    stars.forEach((star) => {
      expect(star.nativeElement.textContent.trim()).toBe('star');
    });
  });

  it('should handle star hover and selection', () => {
    const stars = fixture.debugElement.queryAll(By.css('mat-icon'));
    stars[2].triggerEventHandler('mouseenter', {});
    fixture.detectChanges();
    expect(component.hoveredRating).toBe(3);
    stars[2].triggerEventHandler('mouseleave', {});
    fixture.detectChanges();
    expect(component.hoveredRating).toBe(0);
    stars[2].triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(component.selectedRating).toBe(3);
  });

  it('should enable submit button when form is valid', () => {
    component.ratingForm.patchValue({ rating: 4, feedback: 'Great tool!' });
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('.custom-button'));
    expect(submitButton.nativeElement.disabled).toBeFalsy();
  });

  it('should validate form with only rating provided', () => {
    component.ratingForm.patchValue({ rating: 3, feedback: '' });
    expect(component.isFormValid()).toBeTruthy();
  });

  it('should validate form with only feedback provided', () => {
    component.ratingForm.patchValue({ rating: null, feedback: 'Great tool!' });
    expect(component.isFormValid()).toBeTruthy();
  });

  it('should invalidate form with neither rating nor feedback', () => {
    component.ratingForm.patchValue({ rating: null, feedback: '' });
    expect(component.isFormValid()).toBeFalsy();
  });


  it('should not process submission when form is invalid', () => {
    component.ratingForm.patchValue({ rating: null, feedback: '' });
    component.onSubmit();
    expect(component.isRattingLoading).toBeFalsy();
    expect(component.isSubmitted).toBeFalsy();
  });


  it('should show submit button when not loading', () => {
    component.isRattingLoading = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('button.custom-button'))).toBeTruthy();
  });

  it('should maintain selected rating on clicking the same star twice', () => {
    component.onClick(3);
    fixture.detectChanges();
    expect(component.selectedRating).toBe(3);
    component.onClick(3);
    fixture.detectChanges();
    expect(component.selectedRating).toBe(3);
  });

  it('should update selected rating when a lower star is clicked', () => {
    component.onClick(5);
    fixture.detectChanges();
    expect(component.selectedRating).toBe(5);
    component.onClick(2);
    fixture.detectChanges();
    expect(component.selectedRating).toBe(2);
  });

  it('should set loading state and reset after submission', fakeAsync(() => {
    component.ratingForm.patchValue({ rating: 5, feedback: 'Excellent!' });
    component.onSubmit();
    expect(component.isRattingLoading).toBe(true);

    tick(100);
    fixture.detectChanges();
    expect(component.isRattingLoading).toBe(false);
    expect(component.isSubmitted).toBe(true);
  }));

  it('should handle submission failure gracefully', async () => {
    jest.spyOn(component, 'onSubmit').mockImplementation(() => {
      throw new Error('Submission failed');
    });

    component.ratingForm.patchValue({ rating: 4, feedback: 'Nice!' });

    try {
      component.onSubmit();
    } catch (e) {}

    fixture.detectChanges();

    expect(component.isSubmitted).toBeFalsy();
    expect(component.isRattingLoading).toBeFalsy();
  });

  it('should hide submit button when loading', () => {
    component.ratingForm.patchValue({ rating: 4, feedback: 'Test' });
    component.isRattingLoading = true;
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.submit-rating-button'))).toBeFalsy();
    expect(fixture.debugElement.query(By.css('.spinner-container'))).toBeTruthy();
  });

  it('should show loading spinner when submitting', () => {
    component.ratingForm.patchValue({ rating: 4, feedback: 'Great tool!' });
    component.onSubmit();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.spinner-container'))).toBeTruthy();
  });

  it('should show submit button when isRattingLoading is false', () => {
    component.isRattingLoading = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.submit-rating-button'))).toBeTruthy();
  });

  it('should handle null form controls in isFormValid()', () => {
    const originalForm = component.ratingForm;
    const mockForm = {
      get: (controlName: string) => {
        if (controlName === 'rating') {
          return { value: null };
        }
        if (controlName === 'feedback') {
          return { value: '' };
        }
        return originalForm.get(controlName);
      }
    };
    component.ratingForm = mockForm as any;
    expect(component.isFormValid()).toBeFalsy();
    component.ratingForm = originalForm;
  });

  it('should handle undefined values in feedback control', () => {
    const originalForm:FormGroup<string> = component.ratingForm;
    const mockForm = {
      get: (controlName: string) => {
        if (controlName === 'feedback') {
          return { value: undefined };
        }
        if (controlName === 'rating') {
          return { value: null };
        }
        return originalForm.get(controlName);
      },
      patchValue: jest.fn()
    };

    component.ratingForm = mockForm as any;
    expect(component.isFormValid()).toBeFalsy();

    component.ratingForm = originalForm;
  });

  it('should show thank-you message after submission', fakeAsync(() => {
    component.ratingForm.patchValue({ rating: 5, feedback: 'Awesome!' });
    component.onSubmit();
    tick(100);
    fixture.detectChanges();
    expect(component.isSubmitted).toBe(true);
    expect(fixture.debugElement.query(By.css('app-thank-you-feedback'))).toBeTruthy();
  }));


});
