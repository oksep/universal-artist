import {Injectable} from '@angular/core';

import {Headers, Http, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {Settings} from '../setting/setting.modle';
import {ElectronService} from 'ngx-electron';
import {CommonService} from './common.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export interface OnUploadCallback {
  onUploadProgress(percent: number);

  onUploadError(err: Error);

  onUploadComplete(url: string);

  onLoaded();
}

export interface SingleFileCallback {
  onProgress(file: File, percent: number);
}

export const ASSETS_DOMAIN = environment.domain;

@Injectable()
export class UploadService {

  private eventSource: BehaviorSubject<Array<UploadFile>> = new BehaviorSubject<Array<UploadFile>>([]);

  public uploadFileObservable = this.eventSource.asObservable();

  constructor(private http: Http, private electronService: ElectronService, private homeService: CommonService) {
  }

  private static notifyFileUploadResult(file: UploadFile) {
    const msg = file.status == UploadFileStatus.COMPLETE ? '上传成功' : '上传失败';
    const notification = new Notification(msg, {
      body: file.file.path,
      icon: 'file://' + file.file.path
    });
    notification.close();
  }

  uploadFiles(files: Array<File>) {

    const list = files.map((file) => new UploadFile(file));

    this.eventSource.next(list);

    const setting = Settings.loadSetting();

    const processNext = (index: number) => {
      const uploadFile = list[index];
      uploadFile.status = UploadFileStatus.UPLOADING;
      uploadFile.progress = 50;
      if (uploadFile!=null) {
        return
      }
      if (uploadFile != null) {
        const callback = {
          onUploadProgress: (percent: number) => {
            uploadFile.status = UploadFileStatus.UPLOADING;
            uploadFile.progress = percent;
          },
          onUploadError: (err: Error) => {
            uploadFile.status = UploadFileStatus.FAILED;
            UploadService.notifyFileUploadResult(uploadFile);
            console.log('uploading', uploadFile);
            processNext(++index);
          },
          onUploadComplete: (url: string) => {
            uploadFile.status = UploadFileStatus.COMPLETE;
            uploadFile.progress = 100;

            this.homeService.appendNewImageItem(uploadFile.file, key);

            UploadService.notifyFileUploadResult(uploadFile);
            processNext(++index);
          },
          onLoaded: () => {
          }
        };
        this.electronService.ipcRenderer.once(
          'request-upload-token-callback',
          (event, token: string) => {
            this.uploadToQiniu(uploadFile.file, token, key, callback);
          }
        );
        const key = setting.qiniu.prefix + '/' + this.generateUUID();
        const option = {
          accessKey: setting.qiniu.key,
          secretKey: setting.qiniu.secret,
          bucket: setting.qiniu.bucket,
          key: key
        };
        this.electronService.ipcRenderer.send('request-upload-token', option);
      }
    };
    processNext(0);
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
            callback.onUploadComplete(ASSETS_DOMAIN + result.key);
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

    const headers = new Headers();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    const options = new RequestOptions({headers: headers});

    this.http.post('http://upload.qiniu.com/', formData) // , options)
      .map(res => res.json())
      .catch(error => Observable.throw(error))
      .subscribe(
        data => console.log('success', data),
        error => console.log(error)
      );
  }

  generateUUID() {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
  }

  batchUpload(list: Array<UploadFile>) {

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
