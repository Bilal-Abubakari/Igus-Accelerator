import { TestBed } from '@angular/core/testing';
import { LocalStorageService, LocalStorageKeys } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;
  let localStorageMock: {
    getItem: jest.Mock;
    setItem: jest.Mock;
    removeItem: jest.Mock;
  };

  beforeEach(() => {
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };

    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [LocalStorageService],
    });
    service = TestBed.inject(LocalStorageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLocalItem', () => {
    it('should return null when item does not exist', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = service.getLocalItem(LocalStorageKeys.UPLOADED_MODELS);

      expect(result).toBeNull();
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        LocalStorageKeys.UPLOADED_MODELS,
      );
    });

    it('should return parsed JSON when item exists and is valid JSON', () => {
      const mockData = { test: 'data' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));

      const result = service.getLocalItem(LocalStorageKeys.UPLOADED_MODELS);

      expect(result).toEqual(mockData);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        LocalStorageKeys.UPLOADED_MODELS,
      );
    });

    it('should return raw value when item exists but is not valid JSON', () => {
      const invalidJson = '{invalid:json}';
      localStorageMock.getItem.mockReturnValue(invalidJson);

      const result = service.getLocalItem(LocalStorageKeys.TRANSLATE_LANG);

      expect(result).toBe(invalidJson);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(
        LocalStorageKeys.TRANSLATE_LANG,
      );
    });

    it('should handle localStorage being undefined', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: undefined,
        writable: true,
      });

      const result = service.getLocalItem(LocalStorageKeys.UPLOADED_MODELS);

      expect(result).toBeNull();

      Object.defineProperty(globalThis, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
    });
  });

  describe('setLocalItem', () => {
    it('should set item in localStorage with stringified data', () => {
      const testData = { name: 'test', value: 123 };

      service.setLocalItem(LocalStorageKeys.UPLOADED_MODELS, testData);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LocalStorageKeys.UPLOADED_MODELS,
        JSON.stringify(testData),
      );
    });

    it('should handle primitive data types', () => {
      service.setLocalItem(LocalStorageKeys.TRANSLATE_LANG, 'en');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        LocalStorageKeys.TRANSLATE_LANG,
        JSON.stringify('en'),
      );
    });

    it('should handle localStorage being undefined', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: undefined,
        writable: true,
      });

      expect(() => {
        service.setLocalItem(LocalStorageKeys.UPLOADED_MODELS, {
          test: 'data',
        });
      }).not.toThrow();

      Object.defineProperty(globalThis, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
    });
  });

  describe('removeItem', () => {
    it('should remove item from localStorage', () => {
      service.removeItem(LocalStorageKeys.UPLOADED_MODELS);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith(
        LocalStorageKeys.UPLOADED_MODELS,
      );
    });

    it('should handle localStorage being undefined', () => {
      Object.defineProperty(globalThis, 'localStorage', {
        value: undefined,
        writable: true,
      });

      expect(() => {
        service.removeItem(LocalStorageKeys.UPLOADED_MODELS);
      }).not.toThrow();

      Object.defineProperty(globalThis, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });
    });
  });

  it('should work with all defined LocalStorageKeys', () => {
    Object.values(LocalStorageKeys).forEach((key) => {
      localStorageMock.getItem.mockReturnValue(null);
      service.getLocalItem(key as LocalStorageKeys);
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);

      service.setLocalItem(key as LocalStorageKeys, 'test');
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify('test'),
      );

      service.removeItem(key as LocalStorageKeys);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(key);
    });
  });
});
