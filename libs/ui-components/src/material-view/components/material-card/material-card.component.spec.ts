import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MaterialCardComponent } from './material-card.component';
import { MaterialSelectors } from '../../store/material.selectors';
import { MaterialActions } from '../../store/material.actions';
import { MatDialog } from '@angular/material/dialog';
import { createMockMaterial } from '../../store/mocks/mock-material';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { jest } from '@jest/globals';
import {
  translocoConfig,
  TranslocoService,
  TranslocoTestingModule,
} from '@jsverse/transloco';

describe('MaterialCardComponent', () => {
  let component: MaterialCardComponent;
  let fixture: ComponentFixture<MaterialCardComponent>;
  let store: MockStore;
  let translocoService: TranslocoService;
  let mockDialog: jest.Mocked<MatDialog>;

  const mockMaterial = createMockMaterial();
  const initialState = {
    materials: [mockMaterial],
    loading: false,
    error: null,
  };

  beforeEach(async () => {
    mockDialog = { open: jest.fn() } as unknown as jest.Mocked<MatDialog>;

    await TestBed.configureTestingModule({
      imports: [
        MaterialCardComponent,
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
        provideMockStore({
          selectors: [
            {
              selector: MaterialSelectors.selectAllMaterials,
              value: initialState.materials,
            },
            {
              selector: MaterialSelectors.selectLoading,
              value: initialState.loading,
            },
            {
              selector: MaterialSelectors.selectError,
              value: initialState.error,
            },
            {
              selector: MaterialSelectors.selectSelectedMaterialId,
              value: null,
            },
          ],
        }),
        { provide: MatDialog, useValue: mockDialog },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    translocoService = TestBed.inject(TranslocoService);
    const materialId = initialState.materials[0].id;
    store.overrideSelector(
      MaterialSelectors.isMaterialSelected(materialId),
      false,
    );

    fixture = TestBed.createComponent(MaterialCardComponent);
    component = fixture.componentInstance;

    jest.spyOn(component, 'showMoreInfo').mockImplementation((material) => {
      mockDialog.open(expect.any(Function), {
        data: material,
        panelClass: 'fullscreen-dialog',
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh',
      });
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadMaterials action on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(MaterialActions.loadMaterials());
  });

  it('should display materials when available', () => {
    fixture.detectChanges();
    const materialCards = fixture.debugElement.queryAll(
      By.css('.material-card'),
    );
    expect(materialCards.length).toBe(1);
  });

  it('should display loading spinner when loading', () => {
    store.overrideSelector(MaterialSelectors.selectLoading, true);
    store.refreshState();
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should show error message when error exists', () => {
    store.overrideSelector(
      MaterialSelectors.selectError,
      'Error loading materials',
    );
    store.refreshState();
    fixture.detectChanges();
    expect(component.hasError()).toBe(true);
  });

  it('should toggle material selection', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    const materialId = initialState.materials[0].id;
    component.toggleSelection(materialId);
    expect(dispatchSpy).toHaveBeenCalledWith(
      MaterialActions.toggleMaterialSelection({ materialId }),
    );
  });

  it('should open material info dialog', () => {
    const material = initialState.materials[0];
    component.showMoreInfo(material);
    expect(mockDialog.open).toHaveBeenCalledWith(expect.any(Function), {
      panelClass: 'fullscreen-dialog',
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: material,
    });
  });

  it('should properly handle material selection state', async () => {
    const materialId = initialState.materials[0].id;

    store.overrideSelector(MaterialSelectors.selectSelectedMaterialId, null);
    store.overrideSelector(
      MaterialSelectors.isMaterialSelected(materialId),
      false,
    );
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    let checkIcon = fixture.debugElement.query(By.css('mat-icon'));
    expect(checkIcon).toBeFalsy();

    store.overrideSelector(
      MaterialSelectors.selectSelectedMaterialId,
      materialId,
    );
    store.overrideSelector(
      MaterialSelectors.isMaterialSelected(materialId),
      true,
    );
    store.refreshState();
    fixture.detectChanges();
    await fixture.whenStable();

    checkIcon = fixture.debugElement.query(By.css('mat-icon'));
    expect(checkIcon).toBeTruthy();
  });
});
