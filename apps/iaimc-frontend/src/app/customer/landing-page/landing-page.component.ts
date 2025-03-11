import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  StageComponent,
  MaterialSelectionComponent,
  HowItWorksComponent,
  StayUpdatedComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';
import { FooterComponent } from '../../../../../../libs/ui-components/src/landing-page/footer/footer.component';

@Component({
  selector: 'app-landing-page',
  imports: [
    StageComponent,
    MaterialSelectionComponent,
    FooterComponent,
    MaterialSelectionComponent,
    HowItWorksComponent,
    StayUpdatedComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {}
