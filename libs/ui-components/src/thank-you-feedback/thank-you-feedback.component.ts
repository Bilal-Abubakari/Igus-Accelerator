import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-thank-you-feedback',
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './thank-you-feedback.component.html',
  styleUrl: './thank-you-feedback.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThankYouFeedbackComponent {
  private readonly fb = inject(FormBuilder);
  public submitted = signal(false);
  public contactForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
  });
}
