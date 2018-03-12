import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'qiniudate'
})
export class QiniuDatePipe implements PipeTransform {

  transform(value: any, args?: any): Date {
    return new Date(value / 10000);
  }
}
