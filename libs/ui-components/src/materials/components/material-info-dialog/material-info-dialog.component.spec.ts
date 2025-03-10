import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialInfoDialogComponent } from './material-info-dialog.component';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  translocoConfig,
  TranslocoService,
  TranslocoTestingModule,
} from '@jsverse/transloco';

describe('MaterialInfoDialogComponent', () => {
  let component: MaterialInfoDialogComponent;
  let fixture: ComponentFixture<MaterialInfoDialogComponent>;
  let mockStore: { selectSignal: jest.Mock };
  let mockDialogRef: { close: jest.Mock };
  let translocoService: TranslocoService;

  const mockMaterial = {
    id: '1',
    name: 'Test Material',
    chemicals: [
      { name: 'Chemical A', resistance: '+' },
      { name: 'Chemical B', resistance: 'o' },
      { name: 'Chemical C', resistance: 'x' },
      { name: 'Chemical D', resistance: '+' },
    ],
  };

  beforeEach(async () => {
    mockStore = {
      selectSignal: jest.fn().mockReturnValue(() => mockMaterial),
    };

    mockDialogRef = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        MaterialInfoDialogComponent,
        TranslocoTestingModule.forRoot({
          langs: {
            en: { languageSwitcher: { languageLabel: 'English' } },
            es: { languageSwitcher: { languageLabel: 'Spanish' } },
          },
          translocoConfig: translocoConfig({
            defaultLang: 'en',
          }),
        }),
      ],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { id: 'default-id' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialInfoDialogComponent);
    component = fixture.componentInstance;
    translocoService = TestBed.inject(TranslocoService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter resistantChemicals correctly', () => {
    expect(component.resistantChemicals.length).toBe(2);
    expect(component.resistantChemicals).toEqual([
      { name: 'Chemical A', resistance: '+' },
      { name: 'Chemical D', resistance: '+' },
    ]);
  });

  it('should filter conditionallyResistantChemicals correctly', () => {
    expect(component.conditionallyResistantChemicals.length).toBe(1);
    expect(component.conditionallyResistantChemicals).toEqual([
      { name: 'Chemical B', resistance: 'o' },
    ]);
  });

  it('should filter nonResistantChemicals correctly', () => {
    expect(component.nonResistantChemicals.length).toBe(1);
    expect(component.nonResistantChemicals).toEqual([
      { name: 'Chemical C', resistance: 'x' },
    ]);
  });

  it('should return all chemicals in dataSource', () => {
    expect(component.dataSource()).toEqual(mockMaterial.chemicals);
  });

  it('should return the correct resistance class', () => {
    expect(component.getResistanceClass('o')).toBe('neutral');
    expect(component.getResistanceClass('x')).toBe('bad');
    expect(component.getResistanceClass('+')).toBe('good');
    expect(component.getResistanceClass('unknown')).toBe('unknown');
  });
  it('should close the dialog when close() is called', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
