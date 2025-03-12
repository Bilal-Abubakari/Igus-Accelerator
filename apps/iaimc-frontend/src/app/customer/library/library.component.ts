import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FooterComponent,
  ModelListComponent,
  ModelUploadComponent,
  NavbarComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';

@Component({
  selector: 'app-library',
  imports: [
    FooterComponent,
    ModelUploadComponent,
    NavbarComponent,
    ModelListComponent,
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {}
