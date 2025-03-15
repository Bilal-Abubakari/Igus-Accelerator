import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
} from '@angular/core';
import { FilterOverlayService } from '../../service/materials-filter.service';
import { MaterialsFilterMenuComponent } from '../materials-filter-menu/materials-filter-menu.component';

@Component({
  selector: 'app-materials-filter-container',
  standalone: true,
  imports: [CommonModule, MaterialsFilterMenuComponent],
  templateUrl: './materials-filter-container.component.html',
  styleUrl: './materials-filter-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsFilterContainerComponent {
  private readonly filterOverlayService = inject(FilterOverlayService);

  protected filters = [
    {
      name: 'PFAS/PTFE',
      options: [
        { label: 'PFAS-free ', selected: false },
        { label: 'PTFE-free', selected: false },
      ],
    },
    {
      name: 'Temperature',
      options: [
        { label: 'Below 0°C', selected: false },
        { label: '0-100°C', selected: false },
        { label: '100-200°C', selected: false },
        { label: 'Above 200°C', selected: false },
      ],
    },
    {
      name: 'Food conformity',
      options: [
        { label: 'FDA-Compliant', selected: false },
        { label: 'Conformity according to EU 10/2011', selected: false },
      ],
    },
    {  
      name: 'Environment',
      options: [
        { label: 'Dirt resistance', selected: false },
        { label: 'High chemical resistance', selected: false },
        { label: 'Low moisture absorption', selected: false },
        { label: 'Underwater use', selected: false },
      ],
    },
    {
      name: 'Electricity',
      options: [{ label: 'Electrically conductive', selected: false }],
    },
    {
      name: 'Surface pressure',
      options: [
        { label: 'Low pressure', selected: false },
        { label: 'Medium pressure', selected: false },
        { label: 'High pressure', selected: false },
      ],
    },
  ];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-materials-filter-menu')) {
      this.filterOverlayService.closeAllOverlays();
    }
  }
}
