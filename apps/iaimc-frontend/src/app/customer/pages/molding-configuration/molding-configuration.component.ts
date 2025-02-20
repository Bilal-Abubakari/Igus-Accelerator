import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-molding-configuration',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './molding-configuration.component.html',
  styleUrl: './molding-configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoldingConfigurationComponent {}
