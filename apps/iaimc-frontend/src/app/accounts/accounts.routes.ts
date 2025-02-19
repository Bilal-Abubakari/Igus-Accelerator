import { Routes } from '@angular/router';

export const accountsRoutes: Routes = [
  {
    path: 'customer',
    loadChildren: () =>
      import('./customer/customer.routes').then((m) => m.customerRoutes),
  },
];
