import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-stay-updated',
  imports: [CommonModule, MatIcon, TranslocoPipe],
  templateUrl: './stay-updated.component.html',
  styleUrl: './stay-updated.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StayUpdatedComponent {
  public readonly notificationItems = [
    { key: 'MODEL_ANALYSIS', completed: true },
    { key: 'TECHNICAL_FEEDBACK', completed: true },
    { key: 'QUOTE_READY', completed: true },
  ];
}
