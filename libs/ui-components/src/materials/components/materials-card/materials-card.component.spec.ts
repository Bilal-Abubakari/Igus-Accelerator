import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialsCardComponent } from './materials-card.component';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { By } from '@angular/platform-browser';
import { createMockMaterial } from '../../store/mocks/mock-material';
import { MaterialInfoDialogComponent } from '../material-info-dialog/material-info-dialog.component';
import { InjectionMoldingMaterial } from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { getTranslocoModule } from '../../../transloco-test-config/transloco-testing.module';

describe('MaterialCardComponent', () => {
  let component: MaterialsCardComponent;
  let fixture: ComponentFixture<MaterialsCardComponent>;
  let mockDialog: jest.Mocked<MatDialog>;
  let translocoService: TranslocoService;

  const mockMaterialHighResistance: InjectionMoldingMaterial =
    createMockMaterial({
      id: '1',
      name: 'Test Material',
      colorHex: '#ffffff',
      shrinkage: 0.05,
      highChemicalResistance: true,
      maxTemperature: 100,
    });

  const mockMaterialGeneral: InjectionMoldingMaterial = createMockMaterial({
    id: '2',
    name: 'General Material',
    colorHex: '#000000',
    shrinkage: 0.1,
    highChemicalResistance: false,
    maxTemperature: 80,
  });

  beforeEach(async () => {
    mockDialog = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatProgressBarModule,
        MatButtonModule,
        MatIcon,
        TranslocoPipe,
        MaterialsCardComponent,
        getTranslocoModule(),
      ],
      providers: [{ provide: MatDialog, useValue: mockDialog }],
    }).compileComponents();

    translocoService = TestBed.inject(TranslocoService);
    jest
      .spyOn(translocoService, 'translate')
      .mockImplementation(
        (key: string | string[], params?: Record<string, unknown>) => {
          const translations: Record<string, string> = {
            'materialCard.HIGH_CHEMICAL_RESISTANCE': `Food material with high media resistance up to ${params?.['temp']}°C.`,
            'materialCard.GENERAL_PURPOSE': 'General-purpose material.',
          };

          if (Array.isArray(key)) {
            return key.map((k) => translations[k] || k);
          }

          return translations[key] || key;
        },
      );

    fixture = TestBed.createComponent(MaterialsCardComponent);
    component = fixture.componentInstance;
    component.material = mockMaterialHighResistance;
    component.selectedMaterialId = null;
    component.toggleSelection = jest.fn();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct material description for high resistance material', () => {
    expect(component.getMaterialDescription(mockMaterialHighResistance)).toBe(
      'Food material with high media resistance up to 100°C.',
    );
  });

  it('should return correct material description for general-purpose material', () => {
    expect(component.getMaterialDescription(mockMaterialGeneral)).toBe(
      'General-purpose material.',
    );
  });

  it('should render material name and description', () => {
    const titleElement = fixture.debugElement.query(
      By.css('.material-title'),
    ).nativeElement;
    const descriptionElement = fixture.debugElement.query(
      By.css('.material-description'),
    ).nativeElement;

    expect(titleElement.textContent).toContain(mockMaterialHighResistance.name);
    expect(descriptionElement.textContent).toContain(
      'Food material with high media resistance up to 100°C.',
    );
  });

  it('should render the tolerance progress bar with the correct value', () => {
    const progressBarElement = fixture.debugElement.query(
      By.css('mat-progress-bar'),
    ).nativeElement;
    expect(progressBarElement.getAttribute('ng-reflect-value')).toBe('5');
  });

  it('should call toggleSelection when the card is clicked', () => {
    const cardElement = fixture.debugElement.query(
      By.css('mat-card'),
    ).nativeElement;
    cardElement.click();
    expect(component.toggleSelection).toHaveBeenCalledWith(
      mockMaterialHighResistance.id,
    );
  });

  it('should call toggleSelection when the card is focused and enter is pressed', () => {
    const cardElement = fixture.debugElement.query(
      By.css('mat-card'),
    ).nativeElement;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    cardElement.dispatchEvent(event);
    expect(component.toggleSelection).toHaveBeenCalledWith(
      mockMaterialHighResistance.id,
    );
  });

  it('should open the dialog when the "More Info" button is clicked', () => {
    const buttonElement = fixture.debugElement.query(
      By.css('button'),
    ).nativeElement;
    buttonElement.click();
    expect(mockDialog.open).toHaveBeenCalledWith(MaterialInfoDialogComponent, {
      panelClass: 'fullscreen-dialog',
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: mockMaterialHighResistance,
    });
  });

  it('should not show the check icon when the material is not selected', () => {
    component.selectedMaterialId = mockMaterialGeneral;
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('mat-icon'));
    expect(iconElement).toBeNull();
  });
});
