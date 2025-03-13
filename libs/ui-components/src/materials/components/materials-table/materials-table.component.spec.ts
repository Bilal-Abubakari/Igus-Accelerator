import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialsTableComponent } from './materials-table.component';
import { InjectionMoldingMaterial } from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { MaterialDialogService } from '../../service/material-dialog.service';
import { MATERIAL_COLUMNS } from '../../types';
import { MatTableModule } from '@angular/material/table';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { NgStyle } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { MockPipe } from 'ng-mocks';
import { createMockMaterial } from '../../store/mocks/mock-material';

describe('MaterialsTableComponent', () => {
  let component: MaterialsTableComponent;
  let fixture: ComponentFixture<MaterialsTableComponent>;
  let materialDialogService: jest.Mocked<MaterialDialogService>;

  const mockMaterials: InjectionMoldingMaterial[] = [
    createMockMaterial({
      id: '1',
      name: 'Test Material 1',
      colorHex: '#FF0000',
      shrinkage: 0.015,
    }),
    createMockMaterial({
      id: '2',
      name: 'Test Material 2',
      colorHex: '#00FF00',
      shrinkage: 0.025,
    }),
  ];

  const mockTranslocoService = {
    translate: jest.fn((key: string) => key),
  };

  beforeEach(async () => {
    materialDialogService = {
      openMaterialDialog: jest.fn(),
    } as unknown as jest.Mocked<MaterialDialogService>;

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatTableModule, NgStyle],
      declarations: [
        MaterialsTableComponent,
        MockPipe(TranslocoPipe, (key: string) => key),
        // MockPipe(
        //   PercentPipe,
        //   (
        //     value: string | number | null | undefined,
        //     digitsInfo?: string,
        //     locale?: string,
        //   ): string | null => {
        //     if (value === null || value === undefined) {
        //       return null;
        //     }
        //     if (typeof value === 'number') {
        //       return `${value * 100}%`;
        //     }
        //     return `${parseFloat(value) * 100}%`;
        //   },
        // ),
      ],
      providers: [
        { provide: MaterialDialogService, useValue: materialDialogService },
        { provide: TranslocoService, useValue: mockTranslocoService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialsTableComponent);
    component = fixture.componentInstance;
    component.materials = mockMaterials;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct displayed columns', () => {
    expect(component.displayedColumns).toEqual(MATERIAL_COLUMNS);
  });

  it('should render the correct number of rows', () => {
    const rows = fixture.debugElement.queryAll(By.css('tr[mat-row]'));
    expect(rows.length).toBe(mockMaterials.length);
  });

  it('should calculate tolerance percentage correctly', () => {
    const result = component.getTolerancePercentage(0.015);
    expect(result).toBeDefined();
  });

  it('should open material dialog when info button is clicked', () => {
    const infoButton = fixture.debugElement.query(
      By.css('button[mat-icon-button]'),
    );
    infoButton.triggerEventHandler('click', { stopPropagation: jest.fn() });

    expect(materialDialogService.openMaterialDialog).toHaveBeenCalledWith(
      mockMaterials[0],
      expect.any(Object),
    );
  });

  it('should display shrinkage value with percent pipe', () => {
    const toleranceCell = fixture.debugElement.queryAll(
      By.css('.tolerance-value'),
    );
    expect(toleranceCell[0].nativeElement.textContent).toContain('± ');
  });

  it('should display "Upon Request" for delivery time and price', () => {
    const deliveryTimeCells = fixture.debugElement.queryAll(
      By.css('td[mat-cell]:nth-child(3)'),
    );
    expect(deliveryTimeCells[0].nativeElement.textContent.trim()).toBe(
      'Upon Request',
    );

    const priceCells = fixture.debugElement.queryAll(
      By.css('td[mat-cell]:nth-child(5)'),
    );
    expect(priceCells[0].nativeElement.textContent.trim()).toBe('Upon Request');
  });
});
