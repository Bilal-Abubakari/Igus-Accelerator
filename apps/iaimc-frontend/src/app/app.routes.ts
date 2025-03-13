import { Route } from '@angular/router';
import { NAVIGATION_ROUTES } from 'libs/ui-components/src/navbar/constants';
import { MoldingConfigurationComponent } from './customer/molding-configuration/molding-configuration.component';
import { LibraryComponent } from './customer/library/library.component';
import { ConfigurationComponent } from './customer/molding-configuration/pages/configuration/configuration.component';
import { ProducibilityComponent } from './customer/molding-configuration/pages/producibility/producibility.component';
import { ModelUploadGuard } from './guards/upload.guard';
import { LandingPageComponent } from './customer/landing-page/landing-page.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: NAVIGATION_ROUTES.LANDING_PAGE, pathMatch: 'full' },
  {
    path: NAVIGATION_ROUTES.LANDING_PAGE,
    component: LandingPageComponent,
  },
  {
    path: NAVIGATION_ROUTES.LIBRARY,
    component: LibraryComponent,
  },
  {
    path: NAVIGATION_ROUTES.MOLDING_CONFIGURATION,
    component: MoldingConfigurationComponent,
    // canActivate: [ModelUploadGuard],
    children: [
      {
        path: '',
        redirectTo: NAVIGATION_ROUTES.CONFIGURATIONS,
        pathMatch: 'full',
      },
      {
        path: NAVIGATION_ROUTES.CONFIGURATIONS,
        component: ConfigurationComponent,
      },
      {
        path: NAVIGATION_ROUTES.PRODUCIBILITY,
        component: ProducibilityComponent,
      },
    ],
  },
];
