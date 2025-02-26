import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ThankYouFeedbackComponent } from '../thank-you-feedback/thank-you-feedback.component';

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
  public ratingForm!: FormGroup;
  public currentYear = new Date().getFullYear();
  public hoveredRating = 0;
  public selectedRating = 0;
  public isRattingLoading = false;
  public isSubmitted = false;

  constructor(private readonly fb: FormBuilder) {
    this.ratingForm = this.fb.group({
      feedback: [''],
      rating: [null],
    });
  }

  public isFormValid(): boolean {
    const hasRating = this.ratingForm.get('rating')?.value !== null;
    const hasFeedback = !!this.ratingForm.get('feedback')?.value?.trim();
    return hasRating || hasFeedback;
  }

  public onMouseEnter(rating: number): void {
    this.hoveredRating = rating;
  }

  public onMouseLeave(): void {
    this.hoveredRating = 0;
  }

  public onClick(rating: number): void {
    this.selectedRating = rating;
    this.ratingForm.patchValue({ rating });
  }

  public onSubmit(): void {
    if (!this.isFormValid()) return;
    this.isRattingLoading = true;
    setTimeout(() => {
      this.isRattingLoading = false;
      this.isSubmitted = true;
    }, 100);
  }
}
