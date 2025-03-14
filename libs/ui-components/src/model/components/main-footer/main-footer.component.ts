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
import { formField } from '../../../utilities/helper-function';
import { atLeastOneFieldValidator } from '../../../validators/custom.validator';
import { ThankYouFeedbackComponent } from './components/thank-you-feedback/thank-you-feedback.component';
import { FeedbackRequest } from './footer.interface';
import { FooterService } from './service/footer.service';
import { FooterActions } from './store/footer.actions';
import {
  selectFeedbackLoading,
  selectIsFeedbackSubmitted,
} from './store/footer.selectors';
import { MatDialog } from '@angular/material/dialog';
import { ContactFormComponent } from '../../../contact-form/contact-form.component';

@Component({
  selector: 'app-main-footer',
  imports: [
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
  templateUrl: './main-footer.component.html',
  styleUrl: './main-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainFooterComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly footerService = inject(FooterService);
  private readonly destroyer = new Subject<void>();
  public currentYear = new Date().getFullYear();
  public hoveredRating = signal<number>(0);
  public selectedRating = signal<number>(0);
  public readonly isRatingLoading = this.store.selectSignal(
    selectFeedbackLoading,
  );
  public readonly isSubmitted = this.store.selectSignal(
    selectIsFeedbackSubmitted,
  );

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
      .pipe(takeUntil(this.destroyer))
      .subscribe(() => {
        this.selectedRating.set(0);
      });
  }

  ngOnDestroy() {
    this.destroyer.next();
    this.destroyer.complete();
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

    this.store.dispatch(
      FooterActions.beginSubmitFeedback({ feedback: this.ratingFormValues }),
    );
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

  openContactForm() {
    this.dialog.open(ContactFormComponent, {
      panelClass: ['full-screen-dialog'],
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
    });
  }
}
