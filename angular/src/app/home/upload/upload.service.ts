import {Injectable} from '@angular/core';

import {Headers, Http, RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';
import {Settings} from '../../setting/setting.modle';
import {ElectronService} from 'ngx-electron';
import {HomeService} from '../home.service';

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

  constructor(private http: Http, private electronService: ElectronService, private homeService: HomeService) {
  }


  upload1By1(list: Array<File>, singleFileCallback: SingleFileCallback) {
    const setting = Settings.loadSetting();
    const {requestUploadToken} = this.electronService.remote.require('./qiniu');
    const processNext = () => {
      const file = list.shift();
      if (file != null) {
        const key = setting.qiniu.prefix + '/' + this.generateUUID();
        const token = requestUploadToken({
          accessKey: setting.qiniu.key,
          secretKey: setting.qiniu.secret,
          bucket: setting.qiniu.bucket,
          key: key
        });
        singleFileCallback.onProgress(file, 0);
        const callback = {
          onUploadProgress: (percent: number) => {
            singleFileCallback.onProgress(file, percent);
          },
          onUploadError: (err: Error) => {
            const notification = new Notification('上传失败', {
              body: file.path,
              icon: 'file://' + file.path
            });
            notification.close();
            processNext();
          },
          onUploadComplete: (url: string) => {
            // notify
            const notification = new Notification('上传成功', {
              body: file.path,
              icon: 'file://' + file.path
            });
            notification.close();

            // progress
            singleFileCallback.onProgress(file, 100);

            // to image board
            this.homeService.appendNewImageItem(file, key);

            // next
            processNext();
          },
          onLoaded: () => {
          }
        };
        this.uploadToQiniu(file, token, key, callback);
      } else {
        singleFileCallback.onProgress(null, 0);
      }
    };
    processNext();
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
}

export class CurrentUploadFile {
  file: File;
  progress: number;
}
