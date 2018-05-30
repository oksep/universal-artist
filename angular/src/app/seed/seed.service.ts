import {Injectable} from '@angular/core';

import {ElectronService} from 'ngx-electron';
import {SettingService} from '../setting/setting.service';
import {Seed} from './seed.component';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SeedService {

	constructor(private http: HttpClient,
							private electronService: ElectronService,
							private settingService: SettingService) {
	}

	updateSeedList(category: 'brand' | 'illustration' | 'uiux', data: Seed[]): Observable<any> {
		return Observable.create(observer => {
			this.requestUploadToken(category, (token, key) => {
				console.log('upload token:', token);
				console.log('upload key:', key);

				const formData = new FormData();
				formData.append('token', token);
				formData.append('key', key);
				formData.append('file', new Blob([JSON.stringify(data)], {type: 'application/json'}));

				const request = new XMLHttpRequest();
				request.upload.addEventListener('error', (evt) => {

				}, false);
				request.onload = (e) => {
					if (request.response) {
						try {
							const result: { hash: string, key: string } = JSON.parse(request.response);
							observer.next(result);
							observer.complete();
						} catch (e) {
							Observable.throw(new Error('Response result parse error'));
						}
					} else {
						Observable.throw(new Error('No response error'));
					}
				};
				request.onerror = (error) => {
					Observable.throw(error);
				};

				request.open('POST', 'http://upload.qiniu.com/');
				request.send(formData);
			});
		});
	}

	public requestSeedList(category: 'brand' | 'illustration' | 'uiux') {
		const domain = this.settingService.domain;
		const params = new HttpParams().set('timestamp', Date.now().toString());
		return this.http.get(`${domain}/config/${category}`, {params})
			.do(console.log)
			.catch(error => Observable.throw(error));
	}

	public requestSeedContent(id: string) {
		const domain = this.settingService.domain;
		const params = new HttpParams().set('timestamp', Date.now().toString());
		return this.http.get(`${domain}/md/${id}`, {responseType: 'text', params: params})
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
