import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe, DecimalPipe, CurrencyPipe, PercentPipe } from '@angular/common';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '';
    
    const now = new Date();
    const targetDate = new Date(value);
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
    if (diffInSeconds < 31536000) return `hace ${Math.floor(diffInSeconds / 2592000)} meses`;
    return `hace ${Math.floor(diffInSeconds / 31536000)} años`;
  }
}

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  transform(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength: number = 50): string {
    if (!value) return '';
    if (value.length <= maxLength) return value;
    return value.substring(0, maxLength) + '...';
  }
}

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}

@Pipe({
  name: 'capitalizeWords'
})
export class CapitalizeWordsPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
}

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {
  transform(value: string): string {
    const statusMap: {[key: string]: string} = {
      'active': 'Activo',
      'inactive': 'Inactivo',
      'pending': 'Pendiente',
      'approved': 'Aprobado',
      'rejected': 'Rechazado',
      'suspended': 'Suspendido',
      'completed': 'Completado',
      'cancelled': 'Cancelado',
      'processing': 'Procesando',
      'shipped': 'Enviado',
      'delivered': 'Entregado'
    };
    
    return statusMap[value] || value;
  }
}

@Pipe({
  name: 'severity'
})
export class SeverityPipe implements PipeTransform {
  transform(value: string): string {
    const severityMap: {[key: string]: string} = {
      'low': 'Bajo',
      'medium': 'Medio',
      'high': 'Alto',
      'critical': 'Crítico'
    };
    
    return severityMap[value] || value;
  }
}

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {
  transform(value: string): string {
    const roleMap: {[key: string]: string} = {
      'ADMIN': 'Administrador',
      'EMPLOYEE': 'Empleado',
      'CLIENT': 'Cliente'
    };
    
    return roleMap[value] || value;
  }
}

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {
  transform(value: number, currency: string = 'GTQ', display: string = 'symbol'): string {
    const currencyPipe = new CurrencyPipe('es-GT');
    return currencyPipe.transform(value, currency, display) || 'Q0.00';
  }
}

@Pipe({
  name: 'number'
})
export class NumberPipe implements PipeTransform {
  transform(value: number, digitsInfo: string = '1.2-2'): string {
    const decimalPipe = new DecimalPipe('es-GT');
    return decimalPipe.transform(value, digitsInfo) || '0';
  }
}

@Pipe({
  name: 'percentage'
})
export class PercentagePipe implements PipeTransform {
  transform(value: number, digitsInfo: string = '1.2-2'): string {
    const percentPipe = new PercentPipe('es-GT');
    return percentPipe.transform(value / 100, digitsInfo) || '0%';
  }
}

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {
  transform(value: Date | string, format: string = 'short'): string {
    const datePipe = new DatePipe('es-GT');
    return datePipe.transform(value, format) || '';
  }
}

@Pipe({
  name: 'datetime'
})
export class DateTimePipe implements PipeTransform {
  transform(value: Date | string): string {
    const datePipe = new DatePipe('es-GT');
    return datePipe.transform(value, 'short') || '';
  }
}

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(value: Date | string): string {
    const datePipe = new DatePipe('es-GT');
    return datePipe.transform(value, 'HH:mm') || '';
  }
}

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }
}

@Pipe({
  name: 'plural'
})
export class PluralPipe implements PipeTransform {
  transform(value: number, singular: string, plural: string): string {
    return value === 1 ? singular : plural;
  }
}

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform<T>(items: T[], searchTerm: string, searchFields: string[]): T[] {
    if (!items || !searchTerm) return items;
    
    const term = searchTerm.toLowerCase();
    return items.filter(item => {
      return searchFields.some(field => {
        const value = this.getNestedValue(item, field);
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }
}

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {
  transform<T>(items: T[], field: string, direction: 'asc' | 'desc' = 'asc'): T[] {
    if (!items || !field) return items;
    
    return [...items].sort((a, b) => {
      const aVal = this.getNestedValue(a, field);
      const bVal = this.getNestedValue(b, field);
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }
}

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
  transform<T>(items: T[], field: string): {[key: string]: T[]} {
    if (!items || !field) return {};
    
    return items.reduce((groups, item) => {
      const key = this.getNestedValue(item, field);
      groups[key] = groups[key] || [];
      groups[key].push(item);
      return groups;
    }, {} as {[key: string]: T[]});
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }
}

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {
  transform(value: string, type: 'html' | 'url' | 'resourceUrl' = 'html'): any {
    // This would typically use DomSanitizer in a real implementation
    return value;
  }
}

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
  transform(text: string, searchTerm: string): string {
    if (!text || !searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}

@Pipe({
  name: 'mask'
})
export class MaskPipe implements PipeTransform {
  transform(value: string, visibleChars: number = 4, maskChar: string = '*'): string {
    if (!value) return '';
    
    const masked = value.slice(0, -visibleChars).replace(/./g, maskChar);
    const visible = value.slice(-visibleChars);
    
    return masked + visible;
  }
}

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Format phone number as +502 XXXX-XXXX
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 8) {
      return `+502 ${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    }
    
    return value;
  }
}

@Pipe({
  name: 'nit'
})
export class NITPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Format NIT as XXXX-XXXXXX-XXX-X
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 10)}-${cleaned.slice(6, 9)}-${cleaned.slice(8)}`;
    }
    
    return value;
  }
}



