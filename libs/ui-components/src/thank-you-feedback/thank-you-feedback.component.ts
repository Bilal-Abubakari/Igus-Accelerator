import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
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
  public contactForm!: FormGroup;
  public submitted = signal(false);

  constructor(private readonly fb: FormBuilder) {
    this.contactForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
    });
  }
}
