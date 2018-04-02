import {Injectable, NgZone} from '@angular/core';

import {ElectronService} from 'ngx-electron';
import {BedService} from '../bed/bed.service';
import {SettingService} from '../setting/setting.service';
import {Seed} from './seed.component';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SeedService {

	constructor(private http: HttpClient,
				private electronService: ElectronService,
				private homeService: BedService,
				private ngZone: NgZone,
				private settingService: SettingService) {
	}

	uploadConfig(category: 'brand' | 'illustration' | 'uiux', data: Seed[]) {
		this.requestUploadToken(category, (token, key) => {
			console.log('upload token:', token);
			console.log('upload key:', key);

			const formData = new FormData();
			formData.append('token', token);
			formData.append('key', key);
			formData.append('file', new Blob([JSON.stringify(data)], {type: 'application/json'}));

			const request = new XMLHttpRequest();
			request.open('POST', 'http://upload.qiniu.com/');
			request.send(formData);

		});
	}

	public requestConfig(category: 'brand' | 'illustration' | 'uiux') {
		const domain = this.settingService.domain;
		const params = new HttpParams().set('timestamp', Date.now().toString());
		return this.http.get(`${domain}/config/${category}`, {params})
			.do(console.log)
			.catch(error => Observable.throw(error));
	}

	private requestUploadToken(category: 'brand' | 'illustration' | 'uiux', callback: (token: string, key: string) => void) {
		const setting = this.settingService.setting;
		let key = `config/${category}`;
		const option = {
			accessKey: setting.qiniu.key,
			secretKey: setting.qiniu.secret,
			bucket: setting.qiniu.bucket,
			key: key
		};
		this.electronService.ipcRenderer.once(
			'request-upload-token-callback',
			(event, token: string) => {
				callback(token, key);
			}
		);
		this.electronService.ipcRenderer.send('request-upload-token', option);
	}

}
