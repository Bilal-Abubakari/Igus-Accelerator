import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-producibility',
  imports: [CommonModule],
  templateUrl: './producibility.component.html',
  styleUrl: './producibility.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProducibilityComponent {}
