import {Injectable} from '@angular/core';

import {ElectronService} from 'ngx-electron';
import {SettingService} from '../setting/setting.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import Random from "../util/random";
import {Feed} from "./feed.component";

@Injectable()
export class FeedService {

	constructor(private http: HttpClient,
	            private electronService: ElectronService,
	            private settingService: SettingService) {
	}

	// 请求分类 feed 列表
	public requestFeedList() {
		const domain = this.settingService.domain;
		const params = new HttpParams().set('timestamp', Date.now().toString());
		return this.http.get(`${domain}/feed/list`, {params})
			.do(console.log)
			.map((list: Feed[]) => {
				return this.sortFeedListByDate(list)
			})
			.catch(error => Observable.throw(error));
	}

	sortFeedListByDate(list: Feed[]): Feed[] {
		return list.sort((a: Feed, b: Feed) => {
			return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
		});
	}

	// 请求 feed 正文
	public requestFeedContent(id: string) {
		const domain = this.settingService.domain;
		const params = new HttpParams().set('timestamp', Date.now().toString());
		return this.http.get(`${domain}/md/${id}`, {responseType: 'text', params: params})
			.do(console.log)
			.catch(error => Observable.throw(error));
	}

	// 更新分类列表
	updateFeedList(data: object): Observable<any> {
		return this.upload('feed/list', JSON.stringify(data))
	}

	// 更新 feed 正文
	updateFeedContent(id: string, content: string): Observable<any> {
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

	public getDraft(): Observable<{ feed: Feed, content: string }> {
		return Observable.create(observer => {
			let feed: Feed = null;
			let content: string = null;
			try {
				content = localStorage.getItem("@draft.content");
				const json = localStorage.getItem("@draft.feed");
				if (json != null) {
					feed = JSON.parse(json) as Feed;
				}
			} catch (e) {
				console.error(e);
			}
			if (feed == null) {
				observer.next({
					feed: {
						size: 'normal',
						createTime: new Date().toISOString(),
						id: Random.genHash()
					} as Feed,
					content: content
				});
			} else {
				observer.next({
					feed: feed,
					content: content
				})
			}
			observer.complete()
		})
	}

	public saveDraft(feed: Feed, content: string) {
		if (feed == null) {
			return Observable.of(false);
		}
		return Observable.create(observer => {
			localStorage.setItem("@draft.feed", JSON.stringify(feed));
			localStorage.setItem("@draft.content", content);
			observer.next(true);
			observer.complete();
		});
	}

	public clearDraft() {
		return Observable.create(observer => {
			localStorage.removeItem("@draft.feed");
			localStorage.removeItem("@draft.content");
			observer.next(true);
			observer.complete();
		});
	}

}
