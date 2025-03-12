import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  translocoConfig,
  TranslocoTestingModule
} from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { MaterialInfoDialogComponent } from './material-info-dialog.component';

describe('MaterialInfoDialogComponent', () => {
  let component: MaterialInfoDialogComponent;
  let fixture: ComponentFixture<MaterialInfoDialogComponent>;
  let mockStore: { selectSignal: jest.Mock };
  let mockDialogRef: { close: jest.Mock };

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
      selectSignal: jest.fn().mockReturnValue(signal(mockMaterial)),
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
        { provide: MAT_DIALOG_DATA, useValue: mockMaterial },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter resistantChemicals correctly', () => {
    const resistant = component.resistantChemicals();
    expect(resistant.length).toBe(2);
    expect(resistant).toEqual([
      { name: 'Chemical A', resistance: '+' },
      { name: 'Chemical D', resistance: '+' },
    ]);
  });

  it('should filter conditionallyResistantChemicals correctly', () => {
    const conditional = component.conditionallyResistantChemicals();
    expect(conditional.length).toBe(1);
    expect(conditional).toEqual([{ name: 'Chemical B', resistance: 'o' }]);
  });

  it('should filter nonResistantChemicals correctly', () => {
    const nonResistant = component.nonResistantChemicals();
    expect(nonResistant.length).toBe(1);
    expect(nonResistant).toEqual([{ name: 'Chemical C', resistance: 'x' }]);
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
