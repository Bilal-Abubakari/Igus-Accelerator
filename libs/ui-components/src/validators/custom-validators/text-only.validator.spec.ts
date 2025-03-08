import { FormControl } from '@angular/forms';
import { TextOnlyValidators } from './text-only.validator';

describe('TextOnlyValidators', () => {
  describe('textOnly validator', () => {
    const validator = TextOnlyValidators.textOnly();

    it('should return null for valid text input', () => {
      const control = new FormControl('John Doe');
      expect(validator(control)).toBeNull();
    });

    it('should return null for empty value', () => {
      const control = new FormControl('');
      expect(validator(control)).toBeNull();
    });

    it('should return null for text with hyphens', () => {
      const control = new FormControl('Mary-Jane');
      expect(validator(control)).toBeNull();
    });

    it('should return null for text with apostrophes', () => {
      const control = new FormControl("O'Connor");
      expect(validator(control)).toBeNull();
    });

    it('should return error for text with numbers', () => {
      const control = new FormControl('John123');
      expect(validator(control)).toEqual({ textOnly: true });
    });

    it('should return error for text with special characters', () => {
      const control = new FormControl('John@Doe');
      expect(validator(control)).toEqual({ textOnly: true });
    });
  });

  describe('postalCode validator', () => {
    const validator = TextOnlyValidators.postalCode();

    it('should return null for valid 5-digit postal code', () => {
      const control = new FormControl('12345');
      expect(validator(control)).toBeNull();
    });

    it('should return error for postal code with less than 5 digits', () => {
      const control = new FormControl('1234');
      expect(validator(control)).toEqual({ invalidPostalCode: true });
    });

    it('should return error for postal code with more than 5 digits', () => {
      const control = new FormControl('123456');
      expect(validator(control)).toEqual({ invalidPostalCode: true });
    });

    it('should return error for postal code with non-digit characters', () => {
      const control = new FormControl('1234A');
      expect(validator(control)).toEqual({ invalidPostalCode: true });
    });
  });

  describe('phoneNumber validator', () => {
    const validator = TextOnlyValidators.phoneNumber();

    it('should return null for valid phone number with only digits', () => {
      const control = new FormControl('1234567890');
      expect(validator(control)).toBeNull();
    });

    it('should return null for phone number with plus sign prefix', () => {
      const control = new FormControl('+1234567890');
      expect(validator(control)).toBeNull();
    });

    it('should return null for phone number with hyphens', () => {
      const control = new FormControl('123-456-7890');
      expect(validator(control)).toBeNull();
    });

    it('should return error for phone number with letters', () => {
      const control = new FormControl('123-456-789a');
      expect(validator(control)).toEqual({ invalidPhone: true });
    });

    it('should return error for phone number with special characters', () => {
      const control = new FormControl('123.456.7890');
      expect(validator(control)).toEqual({ invalidPhone: true });
    });
  });

  describe('companyName validator', () => {
    const validator = TextOnlyValidators.companyName();

    it('should return null for valid company name with letters', () => {
      const control = new FormControl('Acme Corporation');
      expect(validator(control)).toBeNull();
    });

    it('should return null for empty value', () => {
      const control = new FormControl('');
      expect(validator(control)).toBeNull();
    });

    it('should return null for company name with allowed special characters', () => {
      const control = new FormControl('Johnson & Johnson, Inc.');
      expect(validator(control)).toBeNull();
    });

    it('should return null for company name with numbers', () => {
      const control = new FormControl('3M Company');
      expect(validator(control)).toBeNull();
    });

    it('should return null for company name with parentheses', () => {
      const control = new FormControl('Acme (Global) Ltd');
      expect(validator(control)).toBeNull();
    });

    it('should return error for company name with disallowed special characters', () => {
      const control = new FormControl('Acme Corp @');
      expect(validator(control)).toEqual({ invalidCompanyName: true });
    });
  });

  describe('fileType validator', () => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const validator = TextOnlyValidators.fileType(allowedTypes);

    it('should return null for empty value', () => {
      const control = new FormControl('');
      expect(validator(control)).toBeNull();
    });

    it('should return null for file with allowed type', () => {
      const mockFile = { type: 'image/jpeg', name: 'test.jpg' };
      const control = new FormControl(mockFile);
      expect(validator(control)).toBeNull();
    });

    it('should return null for another allowed file type', () => {
      const mockFile = { type: 'application/pdf', name: 'test.pdf' };
      const control = new FormControl(mockFile);
      expect(validator(control)).toBeNull();
    });

    it('should return error for file with disallowed type', () => {
      const mockFile = { type: 'text/plain', name: 'test.txt' };
      const control = new FormControl(mockFile);
      expect(validator(control)).toEqual({
        invalidFileType: { allowed: allowedTypes },
      });
    });
  });
});
