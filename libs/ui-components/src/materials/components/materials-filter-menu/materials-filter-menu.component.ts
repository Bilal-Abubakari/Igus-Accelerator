import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { FilterOverlayService } from '../../service/materials-filter.service';
import { ReusableButtonComponent } from '../../../reusable-components/reusable-button/reusable-button.component';

@Component({
  selector: 'app-materials-filter-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReusableButtonComponent,
  ],
  templateUrl: './materials-filter.component.html',
  styleUrl: './materials-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaterialsFilterMenuComponent {
  @Input() filterName = '';
  @Input() filterOptions: { label: string; selected: boolean }[] = [];

  private readonly _selectedCount = signal(0);
  protected selectedCount = computed(() => this._selectedCount());

  tempLow: number | null = null;
  tempHigh: number | null = null;

  pressureLow: number | null = null;
  pressureHigh: number | null = null;

  protected readonly filterOverlayService = inject(FilterOverlayService);

  protected showFilterOverlay = computed(() =>
    this.filterOverlayService.isOverlayVisible(this.filterName),
  );

  constructor() {
    this.updateSelectedCount();
  }

  public toggleOverlay() {
    this.filterOverlayService.closeAllOverlays();
    this.filterOverlayService.toggleOverlayState(this.filterName);
  }

  public updateSelectedCount() {
    const count = this.filterOptions.filter((option) => option.selected).length;
    this._selectedCount.set(count);
  }

  public applyFilter() {
    if (this.filterName === 'Temperature') {
      console.log('Applied temperature filter:', {
        low: this.tempLow,
        high: this.tempHigh,
      });
    } else if (this.filterName === 'Surface pressure') {
      console.log('Applied pressure filter:', {
        low: this.pressureLow,
        high: this.pressureHigh,
      });
    } else {
      console.log(
        'Applied filters:',
        this.filterOptions.filter((option) => option.selected),
      );
    }
    this.filterOverlayService.closeAllOverlays();
  }

  public clearFilter() {
    if (this.filterName === 'Temperature') {
      this.tempLow = null;
      this.tempHigh = null;
    } else if (this.filterName === 'Surface pressure') {
      this.pressureLow = null;
      this.pressureHigh = null;
    } else {
      this.filterOptions.forEach((option) => (option.selected = false));
      this.updateSelectedCount();
    }
  }
}
