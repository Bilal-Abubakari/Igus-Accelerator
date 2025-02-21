import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'contact',
    loadComponent: () =>
      import(
        '../../../../libs/ui-components/src/contact-form/contact-form.component'
      ).then((m) => m.ContactFormComponent),
  },
];
