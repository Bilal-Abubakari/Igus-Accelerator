import { Route } from '@angular/router';

import { LibraryComponent } from './library/library.component';
import { MoldingConfigurationComponent } from './molding-configuration/molding-configuration.component';
import { NAVIGATION_ROUTES } from 'libs/ui-components/src/navbar/constants';

export const customerRoutes: Route[] = [
  { path: '', redirectTo: NAVIGATION_ROUTES.LIBRARY, pathMatch: 'full' },
  { path: NAVIGATION_ROUTES.LIBRARY, component: LibraryComponent },
  {
    path: NAVIGATION_ROUTES.MOLDING_CONFIGURATION,
    component: MoldingConfigurationComponent,
    loadChildren: () =>
      import('./molding-configuration/molding-config.routes').then(
        (m) => m.moldingConfigRoutes,
      ),
  },
];
