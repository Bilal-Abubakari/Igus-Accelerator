import { CommonModule } from '@angular/common';
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
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThankYouFeedbackComponent } from '../thank-you-feedback/thank-you-feedback.component';
import { atLeastOneFieldValidator } from '../custom-validators/custom.validator';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    ThankYouFeedbackComponent,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly fb = inject(FormBuilder);

  public currentYear = new Date().getFullYear();
  public hoveredRating = signal<number>(0);
  public selectedRating = signal<number>(0);
  public isRatingLoading = signal<boolean>(false);
  public isSubmitted = signal<boolean>(false);

  public ratingForm = this.fb.group(
    {
      feedback: this.fb.control(''),
      rating: this.fb.control<number | null>(null, [
        Validators.min(1),
        Validators.max(5),
      ]),
    },
    { validators: atLeastOneFieldValidator() },
  );

  public onMouseEnter(rating: number): void {
    this.hoveredRating.set(rating);
  }

  public onMouseLeave(): void {
    this.hoveredRating.set(0);
  }

  public onClick(rating: number): void {
    this.selectedRating.set(rating);
    this.ratingForm.patchValue({ rating });
  }
}
