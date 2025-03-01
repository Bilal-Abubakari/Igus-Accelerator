import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { ThankYouFeedbackComponent } from './thank-you-feedback.component';

describe('ThankYouFeedbackComponent', () => {
  let component: ThankYouFeedbackComponent;
  let fixture: ComponentFixture<ThankYouFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ThankYouFeedbackComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
        TranslocoTestingModule.forRoot({}),
      ],
      providers: [{ provide: ActivatedRoute, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThankYouFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with email control', () => {
    expect(component.contactForm.contains('email')).toBeTruthy();
  });

  it('should require a valid email', () => {
    const emailControl = component.contactForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalsy();

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();

    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTruthy();
  });

  it('should display success message when submitted is true', () => {
    component.submitted.set(true);
    fixture.detectChanges();

    const successContainer = (
      fixture.nativeElement as HTMLElement
    ).querySelector('.success-container');
    expect(successContainer).toBeDefined();
  });
});
