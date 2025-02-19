import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { ProducibilityComponent } from './pages/producibility/producibility.component';

export const customerRoutes: Route[] = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'configurations', component: ConfigurationComponent },
  { path: 'producibility', component: ProducibilityComponent },
];
