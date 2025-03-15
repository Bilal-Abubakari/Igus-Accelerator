import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { MaterialState } from './material.state';

const STORAGE_KEY = 'materialState';

export function loadState(): MaterialState | undefined {
  try {
    const storedState = localStorage.getItem(STORAGE_KEY);
    return storedState ? JSON.parse(storedState) : undefined;
  } catch {
    return undefined;
  }
}

export function persistMaterialState(
  reducer: ActionReducer<MaterialState>,
): ActionReducer<MaterialState> {
  return (state, action: Action) => {
    const nextState = reducer(state, action);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ viewMode: nextState.viewMode }),
      );
    } catch {
      console.warn('Could not save state to localStorage');
    }

    return nextState;
  };
}

export const materialMetaReducers: MetaReducer<MaterialState>[] = [
  persistMaterialState,
];
