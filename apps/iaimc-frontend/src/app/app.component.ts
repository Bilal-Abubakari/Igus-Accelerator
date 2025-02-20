import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '@igus-accelerator-injection-molding-configurator/ui-components';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [NavbarComponent, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public title = 'Welcome iaimc-frontend';
}
