import { TestBed } from '@angular/core/testing';
import { FeatureFlagService } from './feature-flag.service';
import { environment } from '../environment/environment';

jest.mock('../environment/environment', () => ({
  environment: {
    production: false,
    featureFlags: {
      feature1: true,
      feature2: false,
    },
  },
}));

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(
          (key: string): string | null => localStorageMock[key] || null,
        ),
        setItem: jest.fn((key: string, value: string): void => {
          localStorageMock[key] = value;
        }),
        removeItem: jest.fn((key: string): void => {
          delete localStorageMock[key];
        }),
        clear: jest.fn((): void => {
          localStorageMock = {};
        }),
      },
      writable: true,
    });

    jest.spyOn(console, 'error').mockImplementation((): void => {
      /* no operation */
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('in non-production environment', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [FeatureFlagService],
      });
      service = TestBed.inject(FeatureFlagService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize flags from environment and localStorage', () => {
      localStorageMock['featureFlags'] = JSON.stringify({
        feature3: true,
        feature2: true,
      });
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [FeatureFlagService],
      });
      service = TestBed.inject(FeatureFlagService);

      expect(service.isFeatureEnabled('feature1')()).toBe(true);
      expect(service.isFeatureEnabled('feature2')()).toBe(true);
      expect(service.isFeatureEnabled('feature3')()).toBe(true);
    });

    it('should return false for undefined features', () => {
      expect(service.isFeatureEnabled('nonExistentFeature')()).toBe(false);
    });

    it('should toggle features and save to localStorage', () => {
      service.toggleFeature('feature1');
      expect(service.isFeatureEnabled('feature1')()).toBe(false);

      service.toggleFeature('feature1');
      expect(service.isFeatureEnabled('feature1')()).toBe(true);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'featureFlags',
        expect.any(String),
      );
      const savedFlags = JSON.parse(localStorageMock['featureFlags']);
      expect(savedFlags).toHaveProperty('feature1', true);
    });

    it('should toggle non-existent features', () => {
      service.toggleFeature('newFeature');
      expect(service.isFeatureEnabled('newFeature')()).toBe(true);

      service.toggleFeature('newFeature');
      expect(service.isFeatureEnabled('newFeature')()).toBe(false);
    });

    it('should handle storage events', () => {
      let capturedHandler: (event: StorageEvent) => void = () => {
        /* no operation */
      };
      const addEventListenerSpy = jest
        .spyOn(window, 'addEventListener')
        .mockImplementation(
          (type: string, listener: EventListenerOrEventListenerObject) => {
            if (type === 'storage' && typeof listener === 'function') {
              capturedHandler = listener as (event: StorageEvent) => void;
            }
          },
        );
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [FeatureFlagService],
      });
      service = TestBed.inject(FeatureFlagService);
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'storage',
        expect.any(Function),
      );
      addEventListenerSpy.mockRestore();

      const storageEvent = new StorageEvent('storage', {
        key: 'featureFlags',
        newValue: JSON.stringify({
          feature1: false,
          feature2: true,
          feature3: true,
        }),
      });
      capturedHandler(storageEvent);
      expect(service.isFeatureEnabled('feature1')()).toBe(true);
      expect(service.isFeatureEnabled('feature2')()).toBe(false);
    });

    it('should handle localStorage errors when loading', () => {
      jest.spyOn(localStorage, 'getItem').mockImplementation((): string => {
        throw new Error('localStorage error');
      });
      expect(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          providers: [FeatureFlagService],
        });
        service = TestBed.inject(FeatureFlagService);
      }).not.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error loading feature flags:',
        expect.any(Error),
      );
      expect(service.isFeatureEnabled('feature1')()).toBe(true);
    });

    it('should handle localStorage errors when saving', () => {
      jest.spyOn(localStorage, 'setItem').mockImplementation((): void => {
        throw new Error('localStorage error');
      });
      expect(() => {
        service.toggleFeature('feature1');
      }).not.toThrow();
      expect(service.isFeatureEnabled('feature1')()).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Error saving feature flags:',
        expect.any(Error),
      );
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock['featureFlags'] = 'invalid-json';
      expect(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          providers: [FeatureFlagService],
        });
        service = TestBed.inject(FeatureFlagService);
      }).not.toThrow();
      expect(console.error).toHaveBeenCalledWith(
        'Error loading feature flags:',
        expect.any(Error),
      );
    });
  });

  describe('in production environment', () => {
    beforeEach(() => {
      environment.production = true;
      TestBed.configureTestingModule({
        providers: [FeatureFlagService],
      });
      service = TestBed.inject(FeatureFlagService);
    });

    afterEach(() => {
      environment.production = false;
    });

    it('should not register storage event listener in production', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      service = TestBed.inject(FeatureFlagService);
      expect(addEventListenerSpy).not.toHaveBeenCalledWith(
        'storage',
        expect.any(Function),
      );
    });

    it('should not toggle features in production', () => {
      const initialValue = service.isFeatureEnabled('feature1')();
      service.toggleFeature('feature1');
      expect(service.isFeatureEnabled('feature1')()).toBe(initialValue);
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
