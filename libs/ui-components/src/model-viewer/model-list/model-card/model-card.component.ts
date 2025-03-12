import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ModelConfigurationEntity } from '@igus-accelerator-injection-molding-configurator/libs/shared';

@Component({
  selector: 'app-model-card',
  imports: [MatIconModule],
  templateUrl: './model-card.component.html',
  styleUrl: './model-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelCardComponent {
  @Input() modelConfiguration!: ModelConfigurationEntity;
}
