import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tolerancePercentage',
  standalone: true,
})
export class TolerancePercentagePipe implements PipeTransform {
  transform(value: number): string {
    return `${(value * 100).toFixed(2)}%`;
  }
}
