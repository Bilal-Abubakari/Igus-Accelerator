import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThankYouFeedbackComponent } from './thank-you-feedback.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';

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
    const successMessage = fixture.debugElement.query(
      By.css('.success-container'),
    );
    expect(successMessage).toBeTruthy();
  });
});
