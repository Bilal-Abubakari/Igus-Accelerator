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
    translate: jest.fn((key: string) => {
      if (key === 'materialsTable.UPON_REQUEST') {
        return 'Upon Request';
      }
      return key;
    }),
    selectTranslate: jest.fn((key: string) => {
      if (key === 'materialsTable.UPON_REQUEST') {
        return 'Upon Request';
      }
      return key;
    }),
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

  it('should display "materialsTable.UPON_REQUEST" for delivery time and price', () => {
    const deliveryTimeCells = fixture.debugElement.queryAll(
      By.css('td[mat-cell]:nth-child(3)'),
    );
    expect(deliveryTimeCells[0].nativeElement.textContent.trim()).toBe(
      'materialsTable.UPON_REQUEST',
    );

    const priceCells = fixture.debugElement.queryAll(
      By.css('td[mat-cell]:nth-child(5)'),
    );
    expect(priceCells[0].nativeElement.textContent.trim()).toBe(
      'materialsTable.UPON_REQUEST',
    );
  });
  it('should toggle selection when a row is clicked', () => {
    const rows = fixture.debugElement.queryAll(By.css('tr[mat-row]'));

    rows[0].triggerEventHandler('click', {});
    expect(component.selectedMaterialId).toBe('1');

    rows[0].triggerEventHandler('click', {});
    expect(component.selectedMaterialId).toBeNull();

    rows[1].triggerEventHandler('click', {});
    expect(component.selectedMaterialId).toBe('2');
  });

  it('should toggle selection when Enter key is pressed on a row', () => {
    const rows = fixture.debugElement.queryAll(By.css('tr[mat-row]'));

    rows[0].triggerEventHandler('keydown.enter', {});
    expect(component.selectedMaterialId).toBe('1');

    rows[0].triggerEventHandler('keydown.enter', {});
    expect(component.selectedMaterialId).toBeNull();
  });

  it('should toggle selection when Space key is pressed on a row', () => {
    const rows = fixture.debugElement.queryAll(By.css('tr[mat-row]'));

    rows[0].triggerEventHandler('keydown.space', {});
    expect(component.selectedMaterialId).toBe('1');

    rows[0].triggerEventHandler('keydown.space', {});
    expect(component.selectedMaterialId).toBeNull();
  });

  it('should apply active-row class to selected row', () => {
    const rows = fixture.debugElement.queryAll(By.css('tr[mat-row]'));

    rows[0].triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(rows[0].nativeElement.classList.contains('active-row')).toBeTruthy();

    rows[1].triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(rows[0].nativeElement.classList.contains('active-row')).toBeFalsy();

    expect(rows[1].nativeElement.classList.contains('active-row')).toBeTruthy();
  });

  it('should display material name and color circle', () => {
    const nameCell = fixture.debugElement.query(By.css('.material-name'));
    const colorCircle = fixture.debugElement.query(
      By.css('.material-code-circle'),
    );

    expect(nameCell.nativeElement.textContent).toBe('Test Material 1');
    expect(colorCircle.nativeElement.style.backgroundColor).toBe(
      'rgb(255, 0, 0)',
    );
  });

  it('should update selectedMaterial when showMoreInfo is called', () => {
    component.showMoreInfo(mockMaterials[1]);
    expect(component.selectedMaterial).toBe(mockMaterials[1]);
  });

  it('should pass the correct material to dialog service', () => {
    const mockEvent = { stopPropagation: jest.fn() } as unknown as MouseEvent;
    component.showMoreInfo(mockMaterials[1], mockEvent);

    expect(materialDialogService.openMaterialDialog).toHaveBeenCalledWith(
      mockMaterials[1],
      mockEvent,
    );
  });
});
