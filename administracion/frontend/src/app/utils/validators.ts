import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { REGEX_PATTERNS } from './constants';

export class CustomValidators {
  
  // Email validation
  static email(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const isValid = REGEX_PATTERNS.EMAIL.test(control.value);
    return isValid ? null : { email: true };
  }

  // Phone validation
  static phone(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const isValid = REGEX_PATTERNS.PHONE.test(control.value.replace(/\s/g, ''));
    return isValid ? null : { phone: true };
  }

  // Password validation
  static password(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const value = control.value;
    const errors: ValidationErrors = {};
    
    if (!REGEX_PATTERNS.PASSWORD.test(value)) {
      errors['password'] = true;
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  }

  // NIT validation (Guatemala)
  static nit(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const isValid = REGEX_PATTERNS.NIT.test(control.value);
    return isValid ? null : { nit: true };
  }

  // Currency validation
  static currency(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const isValid = REGEX_PATTERNS.CURRENCY.test(control.value.toString());
    return isValid ? null : { currency: true };
  }

  // URL validation
  static url(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const isValid = REGEX_PATTERNS.URL.test(control.value);
    return isValid ? null : { url: true };
  }

  // Alphanumeric validation
  static alphanumeric(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const isValid = REGEX_PATTERNS.ALPHANUMERIC.test(control.value);
    return isValid ? null : { alphanumeric: true };
  }

  // Alphanumeric with spaces validation
  static alphanumericSpaces(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const isValid = REGEX_PATTERNS.ALPHANUMERIC_SPACES.test(control.value);
    return isValid ? null : { alphanumericSpaces: true };
  }

  // Numbers only validation
  static numbersOnly(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const isValid = REGEX_PATTERNS.NUMBERS_ONLY.test(control.value.toString());
    return isValid ? null : { numbersOnly: true };
  }

  // Decimal validation
  static decimal(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const isValid = REGEX_PATTERNS.DECIMAL.test(control.value.toString());
    return isValid ? null : { decimal: true };
  }

  // Confirm password validation
  static confirmPassword(passwordControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;
      
      const password = control.parent.get(passwordControlName)?.value;
      const confirmPassword = control.value;
      
      if (password !== confirmPassword) {
        return { passwordMismatch: true };
      }
      
      return null;
    };
  }

  // Date range validation
  static dateRange(startDateControlName: string, endDateControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;
      
      const startDate = control.parent.get(startDateControlName)?.value;
      const endDate = control.parent.get(endDateControlName)?.value;
      
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return { dateRange: true };
      }
      
      return null;
    };
  }

  // Min value validation
  static minValue(minValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = parseFloat(control.value);
      if (isNaN(value) || value < minValue) {
        return { minValue: { required: minValue, actual: value } };
      }
      
      return null;
    };
  }

  // Max value validation
  static maxValue(maxValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = parseFloat(control.value);
      if (isNaN(value) || value > maxValue) {
        return { maxValue: { required: maxValue, actual: value } };
      }
      
      return null;
    };
  }

  // Range validation
  static range(minValue: number, maxValue: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = parseFloat(control.value);
      if (isNaN(value) || value < minValue || value > maxValue) {
        return { range: { min: minValue, max: maxValue, actual: value } };
      }
      
      return null;
    };
  }

  // File type validation
  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const file = control.value as File;
      if (file && !allowedTypes.includes(file.type)) {
        return { fileType: { allowed: allowedTypes, actual: file.type } };
      }
      
      return null;
    };
  }

  // File size validation (in MB)
  static fileSize(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const file = control.value as File;
      if (file && file.size > maxSizeInMB * 1024 * 1024) {
        return { fileSize: { maxSize: maxSizeInMB, actual: file.size / (1024 * 1024) } };
      }
      
      return null;
    };
  }

  // Unique value validation
  static uniqueValue(existingValues: string[], caseSensitive: boolean = true): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = caseSensitive ? control.value : control.value.toLowerCase();
      const existing = caseSensitive ? existingValues : existingValues.map(v => v.toLowerCase());
      
      if (existing.includes(value)) {
        return { uniqueValue: true };
      }
      
      return null;
    };
  }

  // Required if validation
  static requiredIf(condition: (control: AbstractControl) => boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (condition(control) && (!control.value || control.value.toString().trim() === '')) {
        return { requiredIf: true };
      }
      
      return null;
    };
  }

  // Required unless validation
  static requiredUnless(condition: (control: AbstractControl) => boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!condition(control) && (!control.value || control.value.toString().trim() === '')) {
        return { requiredUnless: true };
      }
      
      return null;
    };
  }

  // Custom pattern validation
  static pattern(pattern: RegExp, errorKey: string = 'pattern'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const isValid = pattern.test(control.value);
      return isValid ? null : { [errorKey]: true };
    };
  }

  // Age validation
  static age(minAge: number, maxAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const birthDate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
        ? age - 1 
        : age;
      
      if (actualAge < minAge || actualAge > maxAge) {
        return { age: { min: minAge, max: maxAge, actual: actualAge } };
      }
      
      return null;
    };
  }

  // Future date validation
  static futureDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const selectedDate = new Date(control.value);
    const today = new Date();
    
    if (selectedDate <= today) {
      return { futureDate: true };
    }
    
    return null;
  }

  // Past date validation
  static pastDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const selectedDate = new Date(control.value);
    const today = new Date();
    
    if (selectedDate >= today) {
      return { pastDate: true };
    }
    
    return null;
  }

  // Business hours validation (9 AM to 6 PM)
  static businessHours(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const time = new Date(`2000-01-01T${control.value}`);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    const startMinutes = 9 * 60; // 9 AM
    const endMinutes = 18 * 60; // 6 PM
    
    if (totalMinutes < startMinutes || totalMinutes > endMinutes) {
      return { businessHours: true };
    }
    
    return null;
  }

  // Credit card validation
  static creditCard(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const value = control.value.replace(/\s/g, '');
    const cardPattern = /^[0-9]{13,19}$/;
    
    if (!cardPattern.test(value)) {
      return { creditCard: true };
    }
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = value.length - 1; i >= 0; i--) {
      let digit = parseInt(value.charAt(i));
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0 ? null : { creditCard: true };
  }

  // CVV validation
  static cvv(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const value = control.value.toString();
    const cvvPattern = /^[0-9]{3,4}$/;
    
    return cvvPattern.test(value) ? null : { cvv: true };
  }
}



