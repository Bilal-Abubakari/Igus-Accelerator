import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-config-information',
  imports: [CommonModule, TranslocoPipe],
  templateUrl: './config-information.component.html',
  styleUrl: './config-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigInformationComponent {}
