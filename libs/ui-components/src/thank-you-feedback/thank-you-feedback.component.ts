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
import { FeedbackInterface } from '../footer/footer.interface';
import { formField } from '../utilities/helper-function';
import { FooterService } from '../footer/service/footer.service';
import { finalize, Subject, takeUntil } from 'rxjs';

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
  public readonly footerService = inject(FooterService);
  public isSubmitted = signal(false);
  private  readonly unsubscription = new Subject<void>();
  public contactForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
  });

  public getField(field: string) {
    return formField(field, this.contactForm);
  }

  public  onSubmitEmail(){
    if (this.contactForm.invalid) {
      return;
    }
    this.footerService.updateFeedback(this.contactForm.value).pipe(takeUntil(this.unsubscription)
    ).subscribe({
      next: () => {
        this.isSubmitted.set(true);
      },
     error:()=>{
       this.isSubmitted.set(false);
     }
    })
  }

  public get contactFormValues(): FeedbackInterface {
    return {
      email: this.contactForm.get('email')?.value,
    };
  }
}
