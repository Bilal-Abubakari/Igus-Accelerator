import { InjectionMoldingMaterial } from '@igus-accelerator-injection-molding-configurator/shared-types';

export interface MaterialState {
  materials: InjectionMoldingMaterial[];
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
