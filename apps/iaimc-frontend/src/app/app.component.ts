import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '@igus-accelerator-injection-molding-configurator/ui-components';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
