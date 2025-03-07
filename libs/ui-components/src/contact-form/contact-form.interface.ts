export interface ContactFormData {
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
export interface ContactFormResponse {
  success: boolean;
  messageId: string;
}

export interface Country {
  name: string;
  code: string;
}
