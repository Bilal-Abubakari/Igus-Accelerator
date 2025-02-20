import { Route } from '@angular/router';
import { ConfigurationComponent } from '../configuration/configuration.component';
import { ProducibilityComponent } from '../producibility/producibility.component';

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
