import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-config-information',
  imports: [CommonModule],
  templateUrl: './config-information.component.html',
  styleUrl: './config-information.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigInformationComponent {}
