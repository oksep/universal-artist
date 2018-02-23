import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {Settings} from '../setting/setting.modle';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class HomeService {

  private eventSource: BehaviorSubject<Array<ImageItem>> = new BehaviorSubject<Array<ImageItem>>([]);

  public bucketObservable = this.eventSource.asObservable();

  private orderByAsc = true;

  constructor(private electronService: ElectronService) {
    this.electronService.ipcRenderer.on('request-bucket-list-callback', (event, arg) => {
      const list = arg.data.items;
      if (this.orderByAsc) {
        list.sort(((a, b) => a.putTime - b.putTime));
      } else {
        list.sort(((a, b) => b.putTime - a.putTime));
      }
      this.eventSource.next(list);
    });
    this.ensureBucketList();
  }

  ensureBucketList() {
    const setting = Settings.loadSetting();
    const option = {
      accessKey: setting.qiniu.key,
      secretKey: setting.qiniu.secret,
      bucket: setting.qiniu.bucket,
      prefix: setting.qiniu.prefix,
      limit: 1000
    };
    this.electronService.ipcRenderer.send('request-bucket-list', option);
  }

  openUrlInBrowser(url: string) {
    this.electronService.shell.openExternal(url);
  }

  changeOrder() {
    this.orderByAsc = !this.orderByAsc;
    const list = this.eventSource.getValue();
    if (this.orderByAsc) {
      list.sort(((a, b) => a.putTime - b.putTime));
    } else {
      list.sort(((a, b) => b.putTime - a.putTime));
    }
    this.eventSource.next(list);
  }

  get order() {
    return this.orderByAsc;
  }
}

export class ImageItem {
  size: number;
  hash: string;
  key: string;
  mimeType: string;
  putTime: number;
  status: number;
  type: number;
}
