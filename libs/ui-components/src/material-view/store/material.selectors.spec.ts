import { MaterialState } from './material.state';
import { MaterialSelectors } from './material.selectors';
import { createMockMaterial } from '../store/mocks/mock-material';

describe('Material Selectors', () => {
  const mockMaterial = createMockMaterial();
  const mockState: MaterialState = {
    materials: [mockMaterial],
    triggerMaterialFetch: true,
    materialFetchError: 'Error fetching materials',
    selectedMaterialId: 'default-id',
  };

  it('should select the material state', () => {
    const result = MaterialSelectors.selectMaterialState.projector(mockState);
    expect(result).toEqual(mockState);
  });

  it('should select all materials', () => {
    const result = MaterialSelectors.selectAllMaterials.projector(mockState);
    expect(result).toEqual([mockMaterial]);
  });

  it('should select the loading state', () => {
    const result = MaterialSelectors.selectLoading.projector(mockState);
    expect(result).toBe(true);
  });

  it('should select the error state', () => {
    const result = MaterialSelectors.selectError.projector(mockState);
    expect(result).toBe('Error fetching materials');
  });

  it('should select the selected material ID', () => {
    const result =
      MaterialSelectors.selectSelectedMaterialId.projector(mockState);
    expect(result).toBe('default-id');
  });

  it('should check if a material is selected', () => {
    const result =
      MaterialSelectors.isMaterialSelected('default-id').projector(
        'default-id',
      );
    expect(result).toBe(true);

    const result2 =
      MaterialSelectors.isMaterialSelected('non-existent-id').projector(
        'default-id',
      );
    expect(result2).toBe(false);
  });

  it('should select a material by ID', () => {
    const result = MaterialSelectors.selectMaterialById('default-id').projector(
      [mockMaterial],
    );
    expect(result).toEqual(mockMaterial);

    const result2 = MaterialSelectors.selectMaterialById(
      'non-existent-id',
    ).projector([mockMaterial]);
    expect(result2).toBeUndefined();
  });
});
