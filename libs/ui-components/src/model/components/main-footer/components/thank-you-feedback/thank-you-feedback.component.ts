import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { formField } from '../../../../../utilities/helper-function';
import { FeedbackRequest } from '../../footer.interface';
import { FooterService } from '../../service/footer.service';
import { FooterActions } from '../../store/footer.actions';
import {
  selectFeedbackLoading,
  selectIsEmailUpdated,
} from '../../store/footer.selectors';

@Component({
  selector: 'app-thank-you-feedback',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    RouterLink,
    TranslocoPipe,
  ],
  templateUrl: './thank-you-feedback.component.html',
  styleUrl: './thank-you-feedback.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThankYouFeedbackComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  public readonly footerService = inject(FooterService);
  public readonly isSubmitted = this.store.selectSignal(selectIsEmailUpdated);
  public readonly isSubmitLoading = this.store.selectSignal(
    selectFeedbackLoading,
  );
  public contactForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
  });

  public getField(field: string) {
    return formField(field, this.contactForm);
  }

  public onSubmitEmail() {
    const email = this.contactFormValues.email;
    if (!email) {
      return;
    }
    this.store.dispatch(FooterActions.beginUpdateFeedback({ email }));
  }
  public get contactFormValues(): FeedbackRequest {
    return {
      email: this.contactForm.get('email')?.value,
    };
  }
}
