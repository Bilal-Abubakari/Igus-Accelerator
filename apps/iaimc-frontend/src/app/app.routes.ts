import { Route } from '@angular/router';

import { accountsRoutes } from './accounts.routes';
import { NAVIGATION_ROUTES } from 'libs/ui-components/src/navbar/constants';

export const appRoutes: Route[] = [
  { path: '', redirectTo: NAVIGATION_ROUTES.HOME, pathMatch: 'full' },
  ...accountsRoutes,
];
