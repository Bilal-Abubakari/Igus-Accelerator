import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-how-it-works',
  imports: [CommonModule, MatCard, MatCardContent, MatCardTitle, TranslocoPipe],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksComponent {
  public cardContent = [
    {
      titleKey: 'how-it-works.TITLE.UPLOAD_MODEL',
      description: 'how-it-works.DESCRIPTION.UPLOAD_MODEL',
      image: 'assets/images/upload-your-model.svg',
      imageAlt: 'upload your model Image',
    },
    {
      titleKey: 'how-it-works.TITLE.INSTANT_ANALYSIS',
      description: 'how-it-works.DESCRIPTION.INSTANT_ANALYSIS',
      image: 'assets/images/instant-analysis.svg',
      imageAlt: 'instant analysis Image',
    },
    {
      titleKey: 'how-it-works.TITLE.EXPECT_REVIEW',
      description: 'how-it-works.DESCRIPTION.EXPECT_REVIEW',
      image: 'assets/images/expect-review.svg',
      imageAlt: 'expect review Image',
    },
  ];
}
