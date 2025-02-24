import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { ContactFormComponent } from '@igus-accelerator-injection-molding-configurator/ui-components';
@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public title = 'Welcome iaimc-frontend';

  constructor(private dialog: MatDialog) {}

  openContactForm() {
    this.dialog.open(ContactFormComponent, {
      panelClass: ['full-screen-dialog', 'no-padding-dialog'],
    position: {
      top: '0',
      left: '0'
    },
    width: '100%',
    height: '100%',
    maxWidth: '100vw',
    maxHeight: '100vh'
  });
  }
}
