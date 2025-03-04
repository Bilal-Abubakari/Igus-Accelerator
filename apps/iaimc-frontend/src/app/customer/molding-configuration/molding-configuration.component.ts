import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-molding-configuration',
  imports: [CommonModule],
  templateUrl: './molding-configuration.component.html',
  styleUrl: './molding-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoldingConfigurationComponent {}
