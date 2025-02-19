import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '../../../../libs/ui-components/src/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
