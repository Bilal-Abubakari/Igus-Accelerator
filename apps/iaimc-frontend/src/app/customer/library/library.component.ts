import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  MainFooterComponent,
  ModelListComponent,
  ModelUploadComponent,
  NavbarComponent,
} from '@igus-accelerator-injection-molding-configurator/ui-components';

@Component({
  selector: 'app-library',
  imports: [
    MainFooterComponent,
    ModelUploadComponent,
    NavbarComponent,
    ModelListComponent,
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {}
