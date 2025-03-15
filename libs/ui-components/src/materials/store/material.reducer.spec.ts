import { materialReducer } from './material.reducer';
import { MaterialActions } from './material.actions';
import { createMockMaterial } from '../store/mocks/mock-material';
import { initialMaterialState } from './material.state';
import { ViewMode } from '../types';

jest.mock('../../utilities/color.utils', () => ({
  getTextColor: jest.fn().mockReturnValue('#FFFFFF'),
}));

describe('MaterialReducer', () => {
  it('should return the initial state when an unknown action is dispatched', () => {
    const action: { type: string } = { type: 'UNKNOWN_ACTION' };
    const state = materialReducer(undefined, action);
    expect(state).toEqual(initialMaterialState);
  });

  it('should set triggerMaterialFetch to true on loadMaterials', () => {
    const action = MaterialActions.loadMaterials();
    const state = materialReducer(initialMaterialState, action);
    expect(state.triggerMaterialFetch).toBe(true);
    expect(state.materialFetchError).toBeNull();
  });

  it('should toggle material selection correctly', () => {
    const material = createMockMaterial({ id: '1', name: 'Material A' });

    const initialState = {
      ...initialMaterialState,
      materials: [material],
    };

    const action = MaterialActions.toggleMaterialSelection({ materialId: '1' });

    let state = materialReducer(initialState, action);
    expect(state.selectedMaterial).toEqual(material);

    state = materialReducer(state, action);
    expect(state.selectedMaterial).toBeNull();
  });

  it('should set materialFetchError on loadMaterialsFailure', () => {
    const error = 'Failed to fetch materials';
    const action = MaterialActions.loadMaterialsFailure({
      materialFetchError: error,
    });
    const state = materialReducer(initialMaterialState, action);

    expect(state.triggerMaterialFetch).toBe(false);
    expect(state.materialFetchError).toBe(error);
  });

  it('should toggle material selection correctly', () => {
    const material = createMockMaterial({ id: '1', name: 'Material A' });

    const initialState = {
      ...initialMaterialState,
      materials: [material],
    };

    const action = MaterialActions.toggleMaterialSelection({ materialId: '1' });

    let state = materialReducer(initialState, action);
    expect(state.selectedMaterial).toEqual(material);

    state = materialReducer(state, action);
    expect(state.selectedMaterial).toBeNull();
  });
});
it('should update viewMode when setViewMode action is dispatched', () => {
  const initialState = {
    ...initialMaterialState,
    viewMode: 'grid' as ViewMode,
  };

  const action = MaterialActions.setViewMode({ viewMode: 'grid' });
  const state = materialReducer(initialState, action);

  expect(state.viewMode).toBe('grid');
});
it('should update materials and set textColor on loadMaterialsSuccess', () => {
  const materials = [
    createMockMaterial({ id: '1', name: 'Material A', colorHex: '#FF0000' }),
    createMockMaterial({ id: '2', name: 'Material B', colorHex: '#00FF00' }),
  ];

  const action = MaterialActions.loadMaterialsSuccess({ materials });
  const state = materialReducer(initialMaterialState, action);

  expect(state.triggerMaterialFetch).toBe(false);
  expect(state.materialFetchError).toBeNull();
  expect(state.materials.length).toBe(2);
  expect(state.materials[0].textColor).toBe('#FFFFFF');
  expect(state.materials[0].id).toBe('1');
  expect(state.materials[1].id).toBe('2');
});
