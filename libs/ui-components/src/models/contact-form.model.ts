export interface ContactForm {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    postalCode: string;
    country: string;
    telephone?: string;
    message?: string;
    agreement: boolean;
    file: File | null;
  }
  