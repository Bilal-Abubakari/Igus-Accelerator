import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from '../../../../libs/ui-components/src/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
