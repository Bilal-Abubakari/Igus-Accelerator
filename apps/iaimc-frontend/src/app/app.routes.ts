import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'contact',
    loadComponent: () =>
      import('../app/contact-form/contact-form.component').then(
        (c) => c.ContactFormComponent
      ),
  },
];
