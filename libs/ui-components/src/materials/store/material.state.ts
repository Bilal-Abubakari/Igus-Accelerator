import { InjectionMoldingMaterial } from '@igus-accelerator-injection-molding-configurator/libs/shared';
import { ViewMode } from '../types';
import { loadState } from './material.metareducer';

export interface MaterialState {
  materials: InjectionMoldingMaterial[];
  triggerMaterialFetch: boolean;
  materialFetchError: string | null;
  selectedMaterial: InjectionMoldingMaterial | null;
  viewMode: ViewMode;
}

export const initialMaterialState: MaterialState = {
  materials: [],
  triggerMaterialFetch: false,
  materialFetchError: null,
  selectedMaterial: null,
  viewMode: loadState()?.viewMode || 'grid',
};
