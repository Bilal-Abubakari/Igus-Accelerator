import { Action, createReducer, on } from '@ngrx/store';
import { ContactFormActions } from './contact-form.actions';
import {
  ContactFormState,
  initialContactFormState,
} from './contact-form.models';

export const CONTACT_FORM_FEATURE_KEY = 'contactForm';

const reducer = createReducer(
  initialContactFormState,
  on(ContactFormActions.updateFormData, (state, { formData }) => ({
    ...state,
    formData: { ...state.formData, ...formData },
  })),

  on(ContactFormActions.resetForm, () => initialContactFormState),

  on(ContactFormActions.submitForm, (state) => ({
    ...state,
    isSubmitting: true,
    isSubmitted: false,
    error: null,
  })),

  on(ContactFormActions.submitFormSuccess, (state) => ({
    ...state,
    isSubmitting: false,
    isSubmitted: true,
    error: null,
  })),

  on(ContactFormActions.submitFormFailure, (state, { error }) => ({
    ...state,
    isSubmitting: false,
    isSubmitted: false,
    error,
  })),

  on(ContactFormActions.loadCountries, (state) => ({
    ...state,
    isLoadingCountries: true,
    countries: [],
    error: null,
  })),

  on(ContactFormActions.loadCountriesSuccess, (state, { countries }) => ({
    ...state,
    countries,
    isLoadingCountries: false,
    error: null,
  })),

  on(ContactFormActions.loadCountriesFailure, (state, { error }) => ({
    ...state,
    isLoadingCountries: false,
    countries: [],
    error,
  })),
);

export function contactFormReducer(
  state: ContactFormState | undefined,
  action: Action,
) {
  return reducer(state, action);
}
