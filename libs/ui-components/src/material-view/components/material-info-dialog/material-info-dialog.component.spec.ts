import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialInfoDialogComponent } from './material-info-dialog.component';
import { Store } from '@ngrx/store';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createMockMaterial } from '../../store/mocks/mock-material';
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
  const mockMaterial = createMockMaterial();

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

  it('should display the material name in the header', () => {
    const headerElement = fixture.nativeElement.querySelector('header');
    expect(headerElement.textContent).toContain(mockMaterial.name);
    expect(headerElement.style.backgroundColor).toBe('rgb(0, 0, 0)');
  });

  it('should close the dialog when the close button is clicked', () => {
    const closeButton =
      fixture.nativeElement.querySelector('button[mat-button]');
    closeButton.click();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should return the correct resistance class', () => {
    expect(component.getResistanceClass('o')).toBe('neutral');
    expect(component.getResistanceClass('x')).toBe('bad');
    expect(component.getResistanceClass('+')).toBe('good');
    expect(component.getResistanceClass('unknown')).toBe('unknown');
  });
});
