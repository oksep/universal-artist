import {Pipe, PipeTransform} from '@angular/core';
import {environment} from '../../environments/environment';

@Pipe({
  name: 'thumbnail'
})
export class ThumbnailPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    return buildUrl(value);
  }
}

export function buildUrl(key: string): string {
  return environment.domain + key + '?imageView2/1/w/320/h/180/format/webp/q/75|imageslim';
}
