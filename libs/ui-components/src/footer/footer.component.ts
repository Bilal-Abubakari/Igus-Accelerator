import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
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
import { TranslocoPipe } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { formField } from '../utilities/helper-function';
import { atLeastOneFieldValidator } from '../validators/custom-validators/custom.validator';
import { ThankYouFeedbackComponent } from './components/thank-you-feedback/thank-you-feedback.component';
import { FeedbackRequest } from './footer.interface';
import { FooterService } from './service/footer.service';
import { beginSubmitFeedback } from './store/footer.actions';
import {
  selectFeedbackLoading,
  selectIsFeedbackSubmitted,
} from './store/footer.selectors';

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
    TranslocoPipe,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly footerService = inject(FooterService);
  private readonly subscription = new Subject<void>();
  public currentYear = new Date().getFullYear();
  public hoveredRating = signal<number>(0);
  public selectedRating = signal<number>(0);
  public isRatingLoading = this.store.selectSignal(selectFeedbackLoading);
  public isSubmitted = this.store.selectSignal(selectIsFeedbackSubmitted);

  public ratingForm = this.fb.group(
    {
      comment: this.fb.control<string>(''),
      rating: this.fb.control<number | null>(null, [
        Validators.min(1),
        Validators.max(5),
      ]),
    },
    { validators: atLeastOneFieldValidator(['rating', 'comment']) },
  );

  ngOnInit(): void {
    this.footerService
      .getResetObservable()
      .pipe(takeUntil(this.subscription))
      .subscribe(() => {
        this.selectedRating.set(0);
      });
  }

  ngOnDestroy() {
    this.subscription.next();
    this.subscription.complete();
  }

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

  public submitFeedback(): void {
    if (this.ratingForm.invalid) {
      return;
    }
    this.store.dispatch(beginSubmitFeedback(this.ratingFormValues));
  }

  public getField(field: string) {
    return formField(field, this.ratingForm);
  }

  public get ratingFormValues(): FeedbackRequest {
    return {
      rating: this.ratingForm.get('rating')?.value,
      comment: this.ratingForm.get('comment')?.value,
    };
  }
}
