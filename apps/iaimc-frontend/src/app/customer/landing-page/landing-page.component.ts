import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  StageComponent,
  ToolbarComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';

@Component({
  selector: 'app-landing-page',
  imports: [ToolbarComponent, StageComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {}
