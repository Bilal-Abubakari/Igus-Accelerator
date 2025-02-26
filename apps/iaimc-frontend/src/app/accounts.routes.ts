import { Routes } from '@angular/router';
import { NAVIGATION_ROUTES } from 'libs/ui-components/src/navbar/constants';

export const accountsRoutes: Routes = [
  {
    path: NAVIGATION_ROUTES.CUSTOMER,
    loadChildren: () =>
      import('./customer/customer.routes').then((m) => m.customerRoutes),
  },
];
