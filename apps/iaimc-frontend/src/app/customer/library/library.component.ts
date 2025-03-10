import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  MainFooterComponent,
  ModelListComponent,
  StageComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';
import { FooterComponent } from '../../../../../../libs/ui-components/src/landing-page/components/footer/footer.component';

@Component({
  selector: 'app-library',
  imports: [
    StageComponent,
    MainFooterComponent,
    ModelListComponent,
    FooterComponent,
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {}
