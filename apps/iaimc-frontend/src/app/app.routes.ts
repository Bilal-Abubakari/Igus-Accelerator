import { Route } from '@angular/router';

import { accountsRoutes } from './accounts.routes';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'customer/library', pathMatch: 'full' },
  ...accountsRoutes,
];
