import {Injectable} from '@angular/core';

import {ElectronService} from 'ngx-electron';
import {SettingService} from '../setting/setting.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SeedService {

	constructor(private http: HttpClient,
							private electronService: ElectronService,
							private settingService: SettingService) {
	}

	// 请求分类 seed 列表
	public requestSeedList(category: 'brand' | 'illustration' | 'uiux') {
		const domain = this.settingService.domain;
		const params = new HttpParams().set('timestamp', Date.now().toString());
		return this.http.get(`${domain}/config/${category}`, {params})
			.do(console.log)
			.catch(error => Observable.throw(error));
	}

	// 请求 seed 正文
	public requestSeedContent(id: string) {
		const domain = this.settingService.domain;
		const params = new HttpParams().set('timestamp', Date.now().toString());
		return this.http.get(`${domain}/md/${id}`, {responseType: 'text', params: params})
			.do(console.log)
			.catch(error => Observable.throw(error));
	}

	// 更新分类列表
	updateSeedList(category: 'brand' | 'illustration' | 'uiux', data: object): Observable<any> {
		let key = `config/${category}`;
		return this.upload(key, JSON.stringify(data))
	}

	// 更新 seed 正文
	updateSeedContent(id: string, content: string): Observable<any> {
		const key = `md/${id}`;
		return this.upload(key, content);
	}

	public requestAboutMeContent() {
		const domain = this.settingService.domain;
		const params = new HttpParams().set('timestamp', Date.now().toString());
		return this.http.get(`${domain}/md/about-me-content`, {responseType: 'text', params: params})
			.do(console.log)
			.catch(error => Observable.throw(error));
	}

	updateAboutMeContent(content: string): Observable<any> {
		return this.upload('md/about-me-content', content);
	}

	private upload(key: string, data: string): Observable<any> {
		return Observable.create(observer => {
			this.requestUploadToken(key, (token) => {
				console.log('upload token & key:', token, key);

				const formData = new FormData();
				formData.append('token', token);
				formData.append('key', key);
				formData.append('file', new Blob([data], {type: 'application/json'}));

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

	private requestUploadToken(key: string, callback: (token: string) => void) {
		const setting = this.settingService.setting;
		const option = {
			accessKey: setting.qiniu.key,
			secretKey: setting.qiniu.secret,
			bucket: setting.qiniu.bucket,
			key: key
		};
		this.electronService.ipcRenderer.once(
			'request-upload-token-callback',
			(event, token: string) => {
				callback(token);
			}
		);
		this.electronService.ipcRenderer.send('request-upload-token', option);
	}
}
