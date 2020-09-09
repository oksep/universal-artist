import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'qiniuImg'
})
export class QiniuImgPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (args === 'normal') {
      return `${value}?imageView2/1/w/540/h/500/q/100`;
    } else if (args === 'large') {
      return `${value}?imageView2/1/w/540/h/960/q/100`;
    }
    return value;
  }

}
