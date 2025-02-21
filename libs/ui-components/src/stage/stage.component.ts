import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stage',
  imports: [CommonModule],
  templateUrl: './stage.component.html',
  styleUrl: './stage.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StageComponent {
  @Input() title = 'Injection Molding Designer';
  @Input() description =
    "The individual component is created in just a few steps: upload the CAD model, select a material and let us check the manufacturability - that's it. You will immediately see a provisional price and delivery time. After approval you can request a quote.";
  @Input() imageUrl = '/imd-stage.png';
  @Input() imageAlt = 'Injection molding mechanical part';
}
