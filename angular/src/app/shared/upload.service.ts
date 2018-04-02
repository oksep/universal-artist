import {Injectable, NgZone} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {ElectronService} from 'ngx-electron';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {BedService} from '../bed/bed.service';
import Random from '../util/random';
import {SettingService} from '../setting/setting.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export interface OnUploadCallback {
	onUploadProgress(percent: number);

	onUploadError(err: Error);

	onUploadComplete(url: string);

	onLoaded();
}

export interface SingleFileCallback {
	onProgress(file: File, percent: number);
}

@Injectable()
export class UploadService {

	private eventSource: BehaviorSubject<Array<UploadFile>> = new BehaviorSubject<Array<UploadFile>>([]);

	public uploadFileObservable = this.eventSource.asObservable();

	constructor(private http: HttpClient,
				private electronService: ElectronService,
				private homeService: BedService,
				private ngZone: NgZone,
				private settingService: SettingService) {
	}

	private notifyFileUploadResult(uploadStatus: UploadFileStatus, progress: number, uploadFile: UploadFile, key: string) {
		console.log(`UploadResult => file: ${uploadFile.file.path} status: ${uploadStatus} progress: ${progress}`);
		const msg = uploadStatus == UploadFileStatus.COMPLETE ? '上传成功' : '上传失败';
		const notification = new Notification(msg, {
			body: uploadFile.file.path,
			icon: 'file://' + uploadFile.file.path
		});
		notification.close();
		this.ngZone.run(() => {
			uploadFile.status = uploadStatus;
			uploadFile.progress = progress;
			if (uploadStatus == UploadFileStatus.COMPLETE) {
				this.homeService.appendNewImageItem(uploadFile.file, key);
			}
		});
	}

	uploadFiles(files: Array<File>) {

		const list = files.map((file) => new UploadFile(file));

		this.eventSource.next(list);

		const processNext = (index: number) => {
			const uploadFile = list[index];
			if (uploadFile != null) {
				this.requestUploadToken((token, key) => {
					const uploadCallback = {
						onUploadProgress: (percent: number) => {
							this.notifyFileUploadResult(UploadFileStatus.UPLOADING, percent, uploadFile, key);
						},
						onUploadError: (err: Error) => {
							this.notifyFileUploadResult(UploadFileStatus.FAILED, 0, uploadFile, key);
							processNext(++index);
						},
						onUploadComplete: (url: string) => {
							this.notifyFileUploadResult(UploadFileStatus.COMPLETE, 100, uploadFile, key);
							processNext(++index);
						},
						onLoaded: () => {
						}
					};
					this.uploadToQiniu(uploadFile.file, token, key, uploadCallback);
				});
			}
		};
		processNext(0);
	}

	private requestUploadToken(callback: (token: string, key: string) => void) {
		const setting = this.settingService.setting;
		let key = 'img/' + Random.genHash();
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

	// 上传文件至七牛
	private uploadToQiniu(file: File, token: string, key: string, callback: OnUploadCallback) {

		const formData = new FormData();
		formData.append('file', file, key);
		formData.append('token', token);
		formData.append('key', key);

		const request = new XMLHttpRequest();

		if (callback) {
			request.upload.addEventListener('progress', (evt) => {
				if (evt.lengthComputable) {
					const percentComplete = evt.loaded / evt.total;
					callback.onUploadProgress(percentComplete);
				} else {
					// Unable to compute progress information since the total size is unknown
				}
			}, false);
			request.upload.addEventListener('load', () => callback.onLoaded(), false);
			request.upload.addEventListener('error', (evt) => callback.onUploadError(new Error('Upload error')), false);
			request.upload.addEventListener('abort', (evt) => callback.onUploadError(new Error('Abort error')), false);
			request.onload = (e) => {
				if (request.response) {
					try {
						const result: { hash: string, key: string } = JSON.parse(request.response);
						callback.onUploadComplete(this.settingService.domain + result.key);
					} catch (e) {
						console.error(e);
						callback.onUploadError(new Error('Parse response error'));
					}
				} else {
					callback.onUploadError(new Error('No response error'));
				}
			};
			request.onerror = (e) => callback.onUploadError(new Error('Request error'));
		}

		request.open('POST', 'http://upload.qiniu.com/', true);
		request.setRequestHeader('Accept', 'application/json');
		request.send(formData);
	}

	// unused
	private uploadNoProgress(file: File, token: string, key: string) {
		const formData: FormData = new FormData();
		const name = '七七弑神.jpg';
		formData.append('file', file, name);
		formData.append('token', token);
		formData.append('key', name);

		const headers = new HttpHeaders()
			.set('Content-Type', 'multipart/form-data')
			.set('Accept', 'application/json');

		this.http.post('http://upload.qiniu.com/', formData, {headers})
			.catch(error => Observable.throw(error))
			.subscribe(
				data => console.log('success', data),
				error => console.log(error)
			);
	}
}

export class UploadFile {
	file: File;
	progress: number;
	status: UploadFileStatus;

	constructor(file: File) {
		this.file = file;
		this.progress = 0;
		this.status = UploadFileStatus.PENDING;
	}
}

export enum UploadFileStatus {
	PENDING, UPLOADING, COMPLETE, FAILED
}
