import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  StageComponent,
  MaterialSelectionComponent,
  HowItWorksComponent,
  StayUpdatedComponent,
  FooterComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';

@Component({
  selector: 'app-landing-page',
  imports: [
    StageComponent,
    MaterialSelectionComponent,
    FooterComponent,
    HowItWorksComponent,
    StayUpdatedComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent { }
