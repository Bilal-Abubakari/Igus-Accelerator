import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FooterComponent,
  StageComponent,
  ToolbarComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';

@Component({
  selector: 'app-root',
  imports: [FooterComponent, ToolbarComponent, StageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
