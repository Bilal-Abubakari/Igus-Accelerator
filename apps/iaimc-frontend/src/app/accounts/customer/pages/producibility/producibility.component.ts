import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producibility',
  imports: [CommonModule],
  templateUrl: './producibility.component.html',
  styleUrl: './producibility.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProducibilityComponent {}
