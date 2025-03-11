import { ContactFormData, Country } from '../contact-form.interface';

export interface ContactFormState {
  formData: ContactFormData;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
  countries: Country[];
  isLoadingCountries: boolean;
}

export const initialContactFormState: ContactFormState = {
  formData: {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    postalCode: '',
    country: '',
    telephone: '',
    message: '',
    agreement: false,
    file: null,
  },
  isSubmitting: false,
  isSubmitted: false,
  error: null,
  countries: [],
  isLoadingCountries: false,
};
