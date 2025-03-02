import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
  selector: 'app-toolbar',
  imports: [CommonModule, MatToolbar, MatIconModule, MatButtonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  constructor(private readonly dialog: MatDialog) {}
  openContactForm() {
    this.dialog.open(ContactFormComponent, {
      panelClass: ['full-screen-dialog', 'no-padding-dialog'],
      position: {
        top: '0',
        left: '0',
      },
      width: '100%',
      height: '100%',
      maxWidth: '100vw',
      maxHeight: '100vh',
    });
  }
}
