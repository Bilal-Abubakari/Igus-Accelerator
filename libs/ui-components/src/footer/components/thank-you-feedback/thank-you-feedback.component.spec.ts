import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ThankYouFeedbackComponent } from './thank-you-feedback.component';
import { of, throwError } from 'rxjs';
import { FooterService } from '../../service/footer.service';

describe('ThankYouFeedbackComponent', () => {
  let component: ThankYouFeedbackComponent;
  let footerService: jest.Mocked<FooterService>;

  beforeEach(() => {
    const footerServiceMock = {
      updateFeedback: jest.fn(),
    } as unknown as jest.Mocked<FooterService>;

    TestBed.configureTestingModule({
      providers: [
        ThankYouFeedbackComponent,
        FormBuilder,
        { provide: FooterService, useValue: footerServiceMock },
      ],
    });

    component = TestBed.inject(ThankYouFeedbackComponent);
    footerService = TestBed.inject(FooterService) as jest.Mocked<FooterService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with an empty email field', () => {
    expect(component.contactForm.value).toEqual({ email: '' });
  });

  it('should return correct form control when calling getField', () => {
    const emailControl = component.getField('email');
    expect(emailControl).toBe(component.contactForm.get('email'));
  });

  it('should return correct contact form values', () => {
    component.contactForm.setValue({ email: 'test@example.com' });
    expect(component.contactFormValues).toEqual({ email: 'test@example.com' });
  });

  it('should not submit email if form is invalid', () => {
    component.contactForm.setValue({ email: '' });
    component.onSubmitEmail();
    expect(footerService.updateFeedback).not.toHaveBeenCalled();
  });

  it('should call updateFeedback and handle success response', () => {
    footerService.updateFeedback.mockReturnValue(of(undefined));
    component.contactForm.setValue({ email: 'valid@example.com' });

    component.onSubmitEmail();

    expect(component.isSubmitLoading()).toBe(false);
    expect(component.isSubmitted()).toBe(true);
    expect(footerService.updateFeedback).toHaveBeenCalledWith({
      email: 'valid@example.com',
    });
  });

  it('should call updateFeedback and handle error response', () => {
    footerService.updateFeedback.mockReturnValue(
      throwError(() => new Error('Failed')),
    );
    component.contactForm.setValue({ email: 'valid@example.com' });

    component.onSubmitEmail();

    expect(component.isSubmitLoading()).toBe(false);
    expect(component.isSubmitted()).toBe(false);
  });
  it('should return an empty string if email control value is null', () => {
    component.contactForm.get('email')?.setValue(null);
    expect(component.contactFormValues).toEqual({ email: null });
  });

  it('should clean up subscriptions on destroy', () => {
    const subscriptionSpy = jest.spyOn(component['subscription'], 'next');
    component.ngOnDestroy();
    expect(subscriptionSpy).toHaveBeenCalled();
  });
});
