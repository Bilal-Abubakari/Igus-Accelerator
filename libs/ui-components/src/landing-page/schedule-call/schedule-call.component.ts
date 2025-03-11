import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { ReusableButtonComponent } from '../../reusable-components/reusable-button/reusable-button.component';
import { ContactFormComponent } from '../../contact-form/contact-form.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-schedule-call',
  imports: [
    CommonModule,
    TranslocoPipe,
    ReusableButtonComponent,
    MatIcon,
    MatButton,
    RouterLink,
  ],
  templateUrl: './schedule-call.component.html',
  styleUrl: './schedule-call.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleCallComponent {
  private readonly dialog = inject(MatDialog);

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
