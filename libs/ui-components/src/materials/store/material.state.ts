import { InjectionMoldingMaterial } from '@igus-accelerator-injection-molding-configurator/libs/shared';

export interface MaterialState {
  materials: InjectionMoldingMaterial[];
  triggerMaterialFetch: boolean;
  materialFetchError: string | null;
  selectedMaterial: InjectionMoldingMaterial | null;
}

export const initialMaterialState: MaterialState = {
  materials: [],
  triggerMaterialFetch: false,
  materialFetchError: null,
  selectedMaterial: null,
};
