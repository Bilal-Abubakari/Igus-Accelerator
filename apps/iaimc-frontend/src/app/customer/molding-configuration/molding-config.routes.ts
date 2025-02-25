import { Route } from '@angular/router';

import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { ProducibilityComponent } from './pages/producibility/producibility.component';

export const moldingConfigRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/customer/molding-configuration/configurations',
    pathMatch: 'full',
  },
  {
    path: 'configurations',
    component: ConfigurationComponent,
  },
  {
    path: 'producibility',
    component: ProducibilityComponent,
  },
];
