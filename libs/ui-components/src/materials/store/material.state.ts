import { Material } from './material.model';

export interface MaterialState {
  materials: Material[];
  triggerMaterialFetch: boolean;
  materialFetchError: string | null;
  selectedMaterialId: string | null;
}

export const initialMaterialState: MaterialState = {
  materials: [],
  triggerMaterialFetch: false,
  materialFetchError: null,
  selectedMaterialId: null,
};
