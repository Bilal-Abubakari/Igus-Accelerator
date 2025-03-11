import { Action } from '@ngrx/store';
import { ContactFormActions } from '../contact-form.actions';
import { contactFormReducer } from '../reducer/contact-form.reducer';
import {
  ContactFormState,
  initialContactFormState,
} from '../contact-form.models';
import { ContactFormData, Country } from '../../contact-form.interface';

describe('Contact Form Reducer', () => {
  const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });

  const mockCountries: Country[] = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'Mexico', code: 'MX' },
  ];

  describe('valid actions', () => {
    it('should return the default state when no action is provided', () => {
      const action = {} as Action;
      const result = contactFormReducer(undefined, action);

      expect(result).toEqual(initialContactFormState);
    });

    describe('updateFormData action', () => {
      it('should update form data while preserving existing values', () => {
        const initialState: ContactFormState = {
          ...initialContactFormState,
          formData: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            company: 'ACME',
            postalCode: '12345',
            country: 'US',
            telephone: '123-456-7890',
            message: 'Hello',
            file: null,
            agreement: false,
          },
        };

        const partialUpdate: Partial<ContactFormData> = {
          lastName: 'Smith',
          email: 'john.smith@example.com',
        };

        const action = ContactFormActions.updateFormData({
          formData: partialUpdate,
        });
        const result = contactFormReducer(initialState, action);

        expect(result.formData).toEqual({
          ...initialState.formData,
          ...partialUpdate,
        });

        expect(result.isSubmitting).toEqual(initialState.isSubmitting);
        expect(result.isSubmitted).toEqual(initialState.isSubmitted);
      });

      it('should handle updating empty form data', () => {
        const partialUpdate: Partial<ContactFormData> = {
          firstName: 'Jane',
          email: 'jane@example.com',
        };

        const action = ContactFormActions.updateFormData({
          formData: partialUpdate,
        });
        const result = contactFormReducer(initialContactFormState, action);

        expect(result.formData).toEqual({
          ...initialContactFormState.formData,
          ...partialUpdate,
        });
      });
    });

    describe('resetForm action', () => {
      it('should reset the state to initial values', () => {
        const modifiedState: ContactFormState = {
          formData: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            company: 'ACME',
            postalCode: '12345',
            country: 'US',
            telephone: '123-456-7890',
            message: 'Test message',
            file: mockFile,
            agreement: true,
          },
          isSubmitting: true,
          isSubmitted: false,
          isLoadingCountries: false,
          countries: mockCountries,
          error: 'Previous error',
        };

        const action = ContactFormActions.resetForm();
        const result = contactFormReducer(modifiedState, action);

        expect(result).toEqual(initialContactFormState);
      });
    });

    describe('form submission actions', () => {
      it('should set isSubmitting to true when submitting form', () => {
        const formData: ContactFormData = {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          company: 'ACME',
          postalCode: '12345',
          country: 'US',
          telephone: '123-456-7890',
          message: 'Test message',
          file: null,
          agreement: true,
        };

        const action = ContactFormActions.submitForm({ formData });
        const result = contactFormReducer(initialContactFormState, action);

        expect(result.isSubmitting).toBe(true);
        expect(result.isSubmitted).toBe(false);
        expect(result.error).toBeNull();
      });

      it('should handle successful form submission', () => {
        const submittingState: ContactFormState = {
          ...initialContactFormState,
          isSubmitting: true,
        };

        const action = ContactFormActions.submitFormSuccess();
        const result = contactFormReducer(submittingState, action);

        expect(result.isSubmitting).toBe(false);
        expect(result.isSubmitted).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should handle form submission failure', () => {
        const submittingState: ContactFormState = {
          ...initialContactFormState,
          isSubmitting: true,
        };

        const errorMsg = 'Network error';
        const action = ContactFormActions.submitFormFailure({
          error: errorMsg,
        });
        const result = contactFormReducer(submittingState, action);

        expect(result.isSubmitting).toBe(false);
        expect(result.isSubmitted).toBe(false);
        expect(result.error).toEqual(errorMsg);
      });
    });

    describe('loadCountries actions', () => {
      it('should set loading state when loading countries', () => {
        const stateWithCountries: ContactFormState = {
          ...initialContactFormState,
          countries: mockCountries,
        };

        const action = ContactFormActions.loadCountries();
        const result = contactFormReducer(stateWithCountries, action);

        expect(result.isLoadingCountries).toBe(true);
        expect(result.countries).toEqual([]);
        expect(result.error).toBeNull();
      });

      it('should handle successful countries loading', () => {
        const loadingState: ContactFormState = {
          ...initialContactFormState,
          isLoadingCountries: true,
        };

        const action = ContactFormActions.loadCountriesSuccess({
          countries: mockCountries,
        });
        const result = contactFormReducer(loadingState, action);

        expect(result.isLoadingCountries).toBe(false);
        expect(result.countries).toEqual(mockCountries);
        expect(result.error).toBeNull();
      });

      it('should handle countries loading failure', () => {
        const loadingState: ContactFormState = {
          ...initialContactFormState,
          isLoadingCountries: true,
        };

        const errorMsg = 'API error';
        const action = ContactFormActions.loadCountriesFailure({
          error: errorMsg,
        });
        const result = contactFormReducer(loadingState, action);

        expect(result.isLoadingCountries).toBe(false);
        expect(result.countries).toEqual([]);
        expect(result.error).toEqual(errorMsg);
      });
    });
  });

  describe('state mutations', () => {
    it('should not mutate the original state when updating form data', () => {
      const originalState = { ...initialContactFormState };
      const formData: Partial<ContactFormData> = { firstName: 'John' };

      const action = ContactFormActions.updateFormData({ formData });
      const result = contactFormReducer(originalState, action);

      expect(result).not.toBe(originalState);
      expect(result.formData).not.toBe(originalState.formData);
      expect(originalState).toEqual(initialContactFormState);
    });

    it('should preserve unrelated state properties when handling actions', () => {
      const customState: ContactFormState = {
        ...initialContactFormState,
        formData: {
          ...initialContactFormState.formData,
          firstName: 'Jane',
        },
        countries: mockCountries,
      };

      const formData: ContactFormData = {
        ...customState.formData,
      };

      const action = ContactFormActions.submitForm({ formData });
      const result = contactFormReducer(customState, action);

      expect(result.isSubmitting).toBe(true);

      expect(result.formData).toEqual(customState.formData);
      expect(result.countries).toEqual(customState.countries);
    });
  });

  describe('edge cases', () => {
    it('should handle null values in form data updates', () => {
      const initialState = {
        ...initialContactFormState,
        formData: {
          ...initialContactFormState.formData,
          firstName: 'John',
          file: mockFile,
        },
      };

      const formData: Partial<ContactFormData> = {
        firstName: null as unknown as string,
        file: null,
      };

      const action = ContactFormActions.updateFormData({ formData });
      const result = contactFormReducer(initialState, action);

      expect(result.formData.firstName).toBeNull();
      expect(result.formData.file).toBeNull();
    });

    it('should handle empty error messages', () => {
      const action = ContactFormActions.submitFormFailure({ error: '' });
      const result = contactFormReducer(initialContactFormState, action);

      expect(result.error).toBe('');
      expect(result.isSubmitting).toBe(false);
    });
  });
});
