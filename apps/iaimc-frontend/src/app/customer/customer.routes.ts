import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MoldingConfigurationComponent } from './pages/molding-configuration/molding-configuration.component';

export const customerRoutes: Route[] = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'molding-configuration',
    component: MoldingConfigurationComponent,
    loadChildren: () =>
      import('./pages/molding-configuration/molding-config.routes').then(
        (m) => m.moldingConfigRoutes
      ),
  },
];
