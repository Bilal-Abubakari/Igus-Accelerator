import { Action } from '@ngrx/store';
import { MaterialState } from './material.state';
import {
  loadState,
  persistMaterialState,
  STORAGE_KEY,
} from './material.metareducer';

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => {
      return store[key] || null;
    }),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Material State Persistence', () => {
  const initialState: MaterialState = {
    viewMode: 'grid',
    materials: [],
    triggerMaterialFetch: false,
    materialFetchError: null,
    selectedMaterial: null,
  };

  const mockReducer = (state: MaterialState = initialState, action: Action) => {
    switch (action.type) {
      case 'UPDATE_VIEW_MODE':
        return {
          ...state,
          viewMode: (action as any).payload,
        };
      default:
        return state;
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe('persistMaterialState', () => {
    it('should save viewMode to localStorage when state changes', () => {
      const enhancedReducer = persistMaterialState(mockReducer);
      const updateViewModeAction = {
        type: 'UPDATE_VIEW_MODE',
        payload: 'grid',
      };

      const newState = enhancedReducer(initialState, updateViewModeAction);
      expect(newState.viewMode).toBe('grid');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        JSON.stringify({ viewMode: 'grid' }),
      );
    });

    it('should handle localStorage errors gracefully', () => {
      const enhancedReducer = persistMaterialState(mockReducer);
      const updateViewModeAction = {
        type: 'UPDATE_VIEW_MODE',
        payload: 'grid',
      };

      const originalConsoleWarn = console.warn;
      console.warn = jest.fn();

      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('localStorage is not available');
      });

      const newState = enhancedReducer(initialState, updateViewModeAction);

      expect(newState.viewMode).toBe('grid');
      expect(console.warn).toHaveBeenCalledWith(
        'Could not save state to localStorage',
      );

      console.warn = originalConsoleWarn;
    });
  });

  describe('loadState', () => {
    it('should load state from localStorage when available', () => {
      const savedState = { viewMode: 'grid' };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedState));

      const loadedState = loadState();

      expect(loadedState).toEqual(savedState);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should return undefined when localStorage is empty', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);

      const loadedState = loadState();

      expect(loadedState).toBeUndefined();
    });

    it('should return undefined when localStorage throws an error', () => {
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('localStorage is not available');
      });

      const loadedState = loadState();

      expect(loadedState).toBeUndefined();
    });

    it('should return undefined when localStorage contains invalid JSON', () => {
      localStorageMock.getItem.mockReturnValueOnce('invalid json');

      const loadedState = loadState();

      expect(loadedState).toBeUndefined();
    });
  });

  describe('integration', () => {
    it('should correctly persist and load state', () => {
      const enhancedReducer = persistMaterialState(mockReducer);
      const updateViewModeAction = {
        type: 'UPDATE_VIEW_MODE',
        payload: 'grid',
      };
      enhancedReducer(initialState, updateViewModeAction);

      const loadedState = loadState();

      expect(loadedState).toEqual({ viewMode: 'grid' });
    });
  });
});
