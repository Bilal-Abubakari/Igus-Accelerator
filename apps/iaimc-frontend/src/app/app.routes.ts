import { Route } from '@angular/router';
import { ModelLibraryComponent } from '@igus-accelerator-injection-molding-configurator/ui-components';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/model', pathMatch: 'full' },
  { path: 'model', component: ModelLibraryComponent },
];
