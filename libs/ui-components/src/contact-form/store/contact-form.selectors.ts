import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CONTACT_FORM_FEATURE_KEY } from './reducer/contact-form.reducer';
import { ContactFormState } from './contact-form.models';

export const selectContactFormState = createFeatureSelector<ContactFormState>(
  CONTACT_FORM_FEATURE_KEY,
);

export const selectFormData = createSelector(
  selectContactFormState,
  (state) => state.formData,
);

export const selectIsSubmitting = createSelector(
  selectContactFormState,
  (state) => state.isSubmitting,
);

export const selectIsSubmitted = createSelector(
  selectContactFormState,
  (state) => state.isSubmitted,
);

export const selectError = createSelector(
  selectContactFormState,
  (state) => state.error,
);

export const selectCountries = createSelector(
  selectContactFormState,
  (state) => state.countries,
);

export const selectIsLoadingCountries = createSelector(
  selectContactFormState,
  (state) => state.isLoadingCountries,
);
