import { ContactFormDto } from './dto/contact-form.dto';

interface MockFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  destination: string;
  filename: string;
  path: string;
}

export const mockContactFormDto: ContactFormDto = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  company: 'Acme Inc.',
  postalCode: '12345',
  country: 'USA',
  agreement: true,
};

export const mockFile: MockFile = {
  fieldname: 'file',
  originalname: 'dummy.txt',
  encoding: '7bit',
  mimetype: 'text/plain',
  size: 1024,
  buffer: Buffer.from('dummy file content'),
  destination: '',
  filename: '',
  path: '',
};

export const errorContactFormDto: ContactFormDto = {
  firstName: 'Error',
  lastName: 'Case',
  email: 'error@example.com',
  company: 'Acme Inc.',
  postalCode: '00000',
  country: 'USA',
  agreement: true,
};