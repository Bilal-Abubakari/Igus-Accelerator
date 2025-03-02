import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from '../../../../libs/ui-components/src/footer/footer.component';
import { ToolbarComponent } from '@igus-accelerator-injection-molding-configurator/ui-components';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [FooterComponent, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
