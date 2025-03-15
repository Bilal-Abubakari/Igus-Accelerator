import { MaterialState } from './material.state';
import {
  selectMaterialState,
  selectAllMaterials,
  selectLoading,
  selectError,
} from './material.selectors';
import { createMockMaterial } from '../store/mocks/mock-material';

describe('Material Selectors', () => {
  const mockMaterial = createMockMaterial();
  const mockState: MaterialState = {
    materials: [mockMaterial],
    triggerMaterialFetch: true,
    materialFetchError: 'Error fetching materials',
    selectedMaterial: mockMaterial,
    viewMode: 'grid',
  };

  it('should select the material state', () => {
    expect(selectMaterialState.projector(mockState)).toEqual(mockState);
  });

  it('should select all materials', () => {
    expect(selectAllMaterials.projector(mockState)).toEqual([mockMaterial]);
  });

  it('should select the loading state', () => {
    expect(selectLoading.projector(mockState)).toBe(true);
  });

  it('should select the error state', () => {
    expect(selectError.projector(mockState)).toBe('Error fetching materials');
  });
});
