import { materialReducer } from './material.reducer';
import { MaterialActions } from './material.actions';
import { createMockMaterial } from '../store/mocks/mock-material';
import { initialMaterialState } from './material.state';
import { InjectionMoldingMaterial } from '@igus-accelerator-injection-molding-configurator/shared-types';

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

  it('should update materials and reset errors on loadMaterialsSuccess', () => {
    const materials: InjectionMoldingMaterial[] = [
      {
        ...createMockMaterial({
          id: '1',
          name: 'Material A',
          colorHex: '#FF5733',
          shrinkage: 0.5,
        }),
      },
      {
        ...createMockMaterial({
          id: '2',
          name: 'Material B',
          colorHex: '#33FF57',
          shrinkage: 0.3,
        }),
      },
    ];

    const action = MaterialActions.loadMaterialsSuccess({ materials });
    const state = materialReducer(initialMaterialState, action);

    expect(state.triggerMaterialFetch).toBe(false);
    expect(state.materials.length).toBe(2);
    expect(state.materialFetchError).toBeNull();
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
    const action = MaterialActions.toggleMaterialSelection({ materialId: '1' });

    let state = materialReducer(initialMaterialState, action);
    expect(state.selectedMaterialId).toBe('1');

    state = materialReducer(state, action);
    expect(state.selectedMaterialId).toBeNull();
  });
});
