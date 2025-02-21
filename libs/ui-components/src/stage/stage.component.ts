import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stage',
  imports: [CommonModule],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StageComponent {}
