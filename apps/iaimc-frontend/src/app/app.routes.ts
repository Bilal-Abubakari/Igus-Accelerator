import { Route } from '@angular/router';
import { NAVIGATION_ROUTES } from 'libs/ui-components/src/navbar/constants';

import { accountsRoutes } from './accounts.routes';

export const appRoutes: Route[] = [
  { path: '', redirectTo: NAVIGATION_ROUTES.HOME, pathMatch: 'full' },
  ...accountsRoutes,
];
