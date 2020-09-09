import {Pipe, PipeTransform} from '@angular/core';
import {SettingService} from '../setting/setting.service';

@Pipe({
	name: 'thumbnail'
})
export class ThumbnailPipe implements PipeTransform {

	constructor(private settingService: SettingService) {
	}

	transform(value: string, args?: any): string {
		return this.settingService.domain + value + '?imageView2/1/w/320/h/180/format/webp/q/75|imageslim';
	}
}