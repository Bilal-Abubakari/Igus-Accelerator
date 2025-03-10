import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-material-selection',
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    MatIcon,
    MatCardTitle,
    TranslocoPipe,
  ],
  templateUrl: './material-selection.component.html',
  styleUrl: './material-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialSelectionComponent {
  public materials = [
    {
      titleKey: 'material.ABS.TITLE',
      features: [
        'material.ABS.FEATURES.IMPACT',
        'material.ABS.FEATURES.HEAT',
        'material.ABS.FEATURES.FINISH',
      ],
    },
    {
      titleKey: 'material.POLYPROPYLENE.TITLE',
      features: [
        'material.POLYPROPYLENE.FEATURES.CHEMICAL',
        'material.POLYPROPYLENE.FEATURES.FLEXIBLE',
        'material.POLYPROPYLENE.FEATURES.DENSITY',
      ],
    },
    {
      titleKey: 'material.CUSTOM.TITLE',
      features: [
        'material.CUSTOM.FEATURES.SPECIAL',
        'material.CUSTOM.FEATURES.PROPERTIES',
        'material.CUSTOM.FEATURES.CONSULTATION',
      ],
    },
  ];
}
