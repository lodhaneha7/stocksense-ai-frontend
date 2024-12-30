import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sanitizeNumber',
  standalone: true,
})
export class SanitizeNumberPipe implements PipeTransform {
  transform(value: number | string): number {
    if (value === null || value === undefined) {
      return 0; 
    }
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numericValue) || numericValue < 0) {
      return 0;
    }
    return numericValue;
  }
}
