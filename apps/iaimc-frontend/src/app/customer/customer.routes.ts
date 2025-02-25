import { Route } from '@angular/router';
import { LibraryComponent } from './library/library.component';
import { MoldingConfigurationComponent } from './molding-configuration/molding-configuration.component';

export const customerRoutes: Route[] = [
  { path: '', redirectTo: 'library', pathMatch: 'full' },
  { path: 'library', component: LibraryComponent },
  {
    path: 'molding-configuration',
    component: MoldingConfigurationComponent,
    loadChildren: () =>
      import('./molding-configuration/molding-config.routes').then(
        (m) => m.moldingConfigRoutes,
      ),
  },
];
