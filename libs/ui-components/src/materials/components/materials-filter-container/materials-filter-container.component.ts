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

  private createFilter(name: string, options: string[]) {
    return {
      name,
      options: options.map((label) => ({ label, selected: false })),
    };
  }

  protected filters = [
    this.createFilter('PFAS/PTFE', ['PFAS-free', 'PTFE-free']),
    this.createFilter('Temperature', [
      'Below 0°C',
      '0-100°C',
      '100-200°C',
      'Above 200°C',
    ]),
    this.createFilter('Food conformity', [
      'FDA-Compliant',
      'Conformity according to EU 10/2011',
    ]),
    this.createFilter('Environment', [
      'Dirt resistance',
      'High chemical resistance',
      'Low moisture absorption',
      'Underwater use',
    ]),
    this.createFilter('Electricity', ['Electrically conductive']),
    this.createFilter('Surface pressure', [
      'Low pressure',
      'Medium pressure',
      'High pressure',
    ]),
  ];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('app-materials-filter-menu')) {
      this.filterOverlayService.closeAllOverlays();
    }
  }
}
