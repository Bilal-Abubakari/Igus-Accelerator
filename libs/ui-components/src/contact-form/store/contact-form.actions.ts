import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ContactFormData, Country } from '../contact-form.interface';

export const ContactFormActions = createActionGroup({
  source: 'Contact Form',
  events: {
    'Update Form Data': props<{ formData: Partial<ContactFormData> }>(),
    'Reset Form': emptyProps(),
    'Submit Form': props<{ formData: ContactFormData }>(),
    'Submit Form Success': emptyProps(),
    'Submit Form Failure': props<{ error: string }>(),
    'Load Countries': emptyProps(),
    'Load Countries Success': props<{ countries: Country[] }>(),
    'Load Countries Failure': props<{ error: string }>(),
  },
});
