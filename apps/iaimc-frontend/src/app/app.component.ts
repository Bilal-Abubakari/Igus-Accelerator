import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@igus-accelerator-injection-molding-configurator/ui-components';
import { ToolbarComponent } from '../../../../libs/ui-components/src/toolbar/toolbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
