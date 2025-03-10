import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MaterialsComponent } from './materials.component';
import { MaterialSelectors } from './store/material.selectors';
import { MaterialActions } from './store/material.actions';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MaterialsCardComponent } from './components/materials-card/materials-card.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MaterialsComponent', () => {
  let component: MaterialsComponent;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  const initialState = {
    materials: {
      entities: {},
      ids: [],
      loading: false,
      error: null,
      selectedMaterialId: null,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
      imports: [
        MatProgressSpinner,
        MaterialsCardComponent,
        MaterialsComponent,
        TranslocoPipe,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    component = TestBed.createComponent(MaterialsComponent).componentInstance;
    dispatchSpy = jest.spyOn(store, 'dispatch');

    store.overrideSelector(MaterialSelectors.selectAllMaterials, []);
    store.overrideSelector(MaterialSelectors.selectLoading, false);
    store.overrideSelector(MaterialSelectors.selectError, null);
    store.overrideSelector(MaterialSelectors.selectSelectedMaterialId, null);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadMaterials on init', () => {
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(MaterialActions.loadMaterials());
  });

  it('should dispatch toggleMaterialSelection when toggleSelection is called', () => {
    const materialId = '123';
    component.toggleSelection(materialId);
    expect(dispatchSpy).toHaveBeenCalledWith(
      MaterialActions.toggleMaterialSelection({ materialId }),
    );
  });

  it('should correctly compute hasError', () => {
    store.overrideSelector(MaterialSelectors.selectError, 'Some error');
    store.refreshState();
    expect(component.hasError()).toBe(true);
  });

  it('should correctly compute hasError as false when no error exists', () => {
    store.overrideSelector(MaterialSelectors.selectError, null);
    store.refreshState();
    expect(component.hasError()).toBe(false);
  });
});
