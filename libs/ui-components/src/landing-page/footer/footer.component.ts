import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
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
export class FooterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly translocoService = inject(TranslocoService);
  public readonly currentYear = new Date().getFullYear();
  public readonly isSubscriptionLoading = signal<boolean>(false);

  public subscriptionForm = this.fb.group({
    firstName: [
      '',
      [
        Validators.pattern(/^[A-Za-z\s'-]+$/),
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.required,
      ],
    ],
    email: ['', [Validators.email, Validators.required]],
  });

  public getField(field: string) {
    return formField(field, this.subscriptionForm);
  }

  public readonly errorMessages = {
    required: this.translocoService.translate('footer.REQUIRED_FIELD'),
    pattern: this.translocoService.translate('footer.ENTER_VALID_NAME'),
    email: this.translocoService.translate('footer.ENTER_VALID_EMAIL'),
    minlength: this.translocoService.translate('footer.NAME_TOO_SHORT'),
    maxlength: this.translocoService.translate('footer.NAME_TOO_LONG'),
  };
}
