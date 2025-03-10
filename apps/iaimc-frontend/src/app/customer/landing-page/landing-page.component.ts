import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  StageComponent,
  ToolbarComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';
import {
  FooterComponent
} from '../../../../../../libs/ui-components/src/landing-page/components/footer/footer.component';

@Component({
  selector: 'app-landing-page',
  imports: [ToolbarComponent, StageComponent, FooterComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {}
