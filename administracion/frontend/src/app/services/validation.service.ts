import { Injectable } from '@angular/core';
import { FormControl, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  
  // Custom validators
  static emailValidator(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (control.value && !emailRegex.test(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  static phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (control.value && !phoneRegex.test(control.value.replace(/\s/g, ''))) {
      return { invalidPhone: true };
    }
    return null;
  }

  static passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;

    const errors: ValidationErrors = {};
    
    if (!hasUpperCase) errors['missingUpperCase'] = true;
    if (!hasLowerCase) errors['missingLowerCase'] = true;
    if (!hasNumeric) errors['missingNumeric'] = true;
    if (!hasSpecialChar) errors['missingSpecialChar'] = true;
    if (!isLongEnough) errors['tooShort'] = true;

    return Object.keys(errors).length > 0 ? errors : null;
  }

  static confirmPasswordValidator(passwordControlName: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.parent?.get(passwordControlName)?.value;
      const confirmPassword = control.value;
      
      if (password !== confirmPassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  static minValueValidator(minValue: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = parseFloat(control.value);
      if (control.value && (isNaN(value) || value < minValue)) {
        return { minValue: { required: minValue, actual: value } };
      }
      return null;
    };
  }

  static maxValueValidator(maxValue: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = parseFloat(control.value);
      if (control.value && (isNaN(value) || value > maxValue)) {
        return { maxValue: { required: maxValue, actual: value } };
      }
      return null;
    };
  }

  static dateRangeValidator(startDateControlName: string, endDateControlName: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = control.parent?.get(startDateControlName)?.value;
      const endDate = control.parent?.get(endDateControlName)?.value;
      
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return { invalidDateRange: true };
      }
      return null;
    };
  }

  static uniqueValueValidator(existingValues: string[], caseSensitive: boolean = true) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = caseSensitive ? control.value : control.value.toLowerCase();
      const existing = caseSensitive ? existingValues : existingValues.map(v => v.toLowerCase());
      
      if (existing.includes(value)) {
        return { notUnique: true };
      }
      return null;
    };
  }

  static fileTypeValidator(allowedTypes: string[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const file = control.value as File;
      if (file && !allowedTypes.includes(file.type)) {
        return { invalidFileType: { allowed: allowedTypes, actual: file.type } };
      }
      return null;
    };
  }

  static fileSizeValidator(maxSizeInMB: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const file = control.value as File;
      if (file && file.size > maxSizeInMB * 1024 * 1024) {
        return { fileTooLarge: { maxSize: maxSizeInMB, actual: file.size / (1024 * 1024) } };
      }
      return null;
    };
  }

  // Helper methods
  getErrorMessage(control: AbstractControl, fieldName: string): string {
    if (control.errors) {
      const errors = control.errors;
      
      if (errors['required']) return `${fieldName} es requerido`;
      if (errors['email']) return `${fieldName} debe ser un email válido`;
      if (errors['invalidEmail']) return `${fieldName} debe ser un email válido`;
      if (errors['invalidPhone']) return `${fieldName} debe ser un teléfono válido`;
      if (errors['minlength']) return `${fieldName} debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
      if (errors['maxlength']) return `${fieldName} no puede tener más de ${errors['maxlength'].requiredLength} caracteres`;
      if (errors['min']) return `${fieldName} debe ser mayor o igual a ${errors['min'].min}`;
      if (errors['max']) return `${fieldName} debe ser menor o igual a ${errors['max'].max}`;
      if (errors['minValue']) return `${fieldName} debe ser mayor o igual a ${errors['minValue'].required}`;
      if (errors['maxValue']) return `${fieldName} debe ser menor o igual a ${errors['maxValue'].required}`;
      if (errors['pattern']) return `${fieldName} tiene un formato inválido`;
      if (errors['passwordMismatch']) return 'Las contraseñas no coinciden';
      if (errors['notUnique']) return `${fieldName} ya existe`;
      if (errors['invalidDateRange']) return 'La fecha de inicio debe ser anterior a la fecha de fin';
      if (errors['invalidFileType']) return `Tipo de archivo no válido. Tipos permitidos: ${errors['invalidFileType'].allowed.join(', ')}`;
      if (errors['fileTooLarge']) return `El archivo es demasiado grande. Tamaño máximo: ${errors['fileTooLarge'].maxSize}MB`;
      
      // Password specific errors
      if (errors['missingUpperCase']) return 'La contraseña debe contener al menos una letra mayúscula';
      if (errors['missingLowerCase']) return 'La contraseña debe contener al menos una letra minúscula';
      if (errors['missingNumeric']) return 'La contraseña debe contener al menos un número';
      if (errors['missingSpecialChar']) return 'La contraseña debe contener al menos un carácter especial';
      if (errors['tooShort']) return 'La contraseña debe tener al menos 8 caracteres';
    }
    
    return '';
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getFormErrors(formGroup: FormGroup): {[key: string]: string} {
    const errors: {[key: string]: string} = {};
    
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control && control.errors && control.touched) {
        errors[key] = this.getErrorMessage(control, key);
      }
      
      if (control instanceof FormGroup) {
        const nestedErrors = this.getFormErrors(control);
        Object.keys(nestedErrors).forEach(nestedKey => {
          errors[`${key}.${nestedKey}`] = nestedErrors[nestedKey];
        });
      }
    });
    
    return errors;
  }
}



