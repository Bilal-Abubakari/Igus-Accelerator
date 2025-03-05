import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  StageComponent,
  FooterComponent,
  ModelListComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';

@Component({
  selector: 'app-library',
  imports: [StageComponent, FooterComponent, ModelListComponent],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {}
