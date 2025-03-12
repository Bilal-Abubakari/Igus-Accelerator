import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModelLogoComponent } from '../../svgs/model-logo/model-logo.component';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { formField } from '../../utilities/helper-function';
import { ReusableFormFieldComponent } from '../../reusable-components/reusable-form-field/reusable-form-field.component';
import { ReusableButtonComponent } from '../../reusable-components/reusable-button/reusable-button.component';
import { Store } from '@ngrx/store';
import { NewsletterActions } from './store/footer.actions';
import { SubscriptionRequest } from './footer.interface';
import { selectIsSubscriptionLoading } from './store/footer.selectors';
import { FooterService } from './service/footer/footer.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-footer',
  imports: [
    MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    ModelLogoComponent,
    TranslocoPipe,
    MatProgressSpinnerModule,
    MatInputModule,
    RouterLink,
    MatIconModule,
    ReusableFormFieldComponent,
    ReusableButtonComponent,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly footerService = inject(FooterService);
  private readonly destroyer = new Subject<void>();
  private readonly store = inject(Store);
  private readonly translocoService = inject(TranslocoService);
  public readonly currentYear = new Date().getFullYear();
  public readonly isSubscriptionLoading = this.store.selectSignal(
    selectIsSubscriptionLoading,
  );

  public subscriptionForm = this.fb.group({
    firstName: this.fb.control<string>('', [
      Validators.pattern(/^[A-Za-z\s'-]+$/),
      Validators.minLength(2),
      Validators.maxLength(50),
      Validators.required,
    ]),
    email: this.fb.control<string>('', [Validators.email, Validators.required]),
  });

  ngOnInit(): void {
    this.footerService
      .getResetObservable()
      .pipe(takeUntil(this.destroyer))
      .subscribe(() => {
        this.subscriptionForm.reset();
      });
  }

  ngOnDestroy(): void {
    this.destroyer.next();
    this.destroyer.complete();
  }

  public getField(field: string) {
    return formField(field, this.subscriptionForm);
  }

  public onSubscribe() {
    if (this.subscriptionForm.invalid) {
      return;
    }
    console.log(this.subscriptionFormValues);
    this.store.dispatch(
      NewsletterActions.subscribe({ subscriber: this.subscriptionFormValues }),
    );
  }

  public get subscriptionFormValues(): SubscriptionRequest {
    return {
      firstName: this.subscriptionForm.get('firstName')!.value,
      email: this.subscriptionForm.get('email')!.value,
    };
  }

  public readonly errorMessages = {
    required: this.translocoService.translate('footer.REQUIRED_FIELD'),
    pattern: this.translocoService.translate('footer.ENTER_VALID_NAME'),
    email: this.translocoService.translate('footer.ENTER_VALID_EMAIL'),
    minlength: this.translocoService.translate('footer.NAME_TOO_SHORT'),
    maxlength: this.translocoService.translate('footer.NAME_TOO_LONG'),
  };
}
