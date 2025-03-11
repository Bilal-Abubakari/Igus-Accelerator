import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-model-logo',
  imports: [CommonModule],
  templateUrl: './model-logo.component.html',
  styleUrl: './model-logo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelLogoComponent {}
