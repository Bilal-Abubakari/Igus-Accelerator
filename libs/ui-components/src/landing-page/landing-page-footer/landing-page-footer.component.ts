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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ModelLogoComponent } from '../../svgs/model-logo/model-logo.component';
import { formField } from '../../utilities/helper-function';

@Component({
  selector: 'app-landing-page-footer',
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
  ],
  templateUrl: './landing-page-footer.component.html',
  styleUrl: './landing-page-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageFooterComponent {
  private readonly fb = inject(FormBuilder);
  public currentYear = new Date().getFullYear();
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
}
