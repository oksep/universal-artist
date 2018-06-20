import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SettingService} from '../setting/setting.service';
import Random from "../util/random";

@Injectable()
export class BedService {
	private eventSource: BehaviorSubject<Array<ImageItem>> = new BehaviorSubject<Array<ImageItem>>([]);

	public bucketObservable = this.eventSource.asObservable();

	private orderByAsc = true;

	constructor(private electronService: ElectronService, private settingService: SettingService) {
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
		const setting = this.settingService.setting;
		const option = {
			accessKey: setting.qiniu.key,
			secretKey: setting.qiniu.secret,
			bucket: setting.qiniu.bucket,
			prefix: 'img/',
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

	appendNewImageItem(file: File, key: string) {
		const list = this.eventSource.getValue();
		const item = new ImageItem();
		item.key = key;
		item.putTime = new Date().getMilliseconds();
		list.push(item);
		this.eventSource.next(list);
	}

	removeImageItem(item: ImageItem) {
		const list = this.eventSource.getValue();
		const index = list.indexOf(item);
		if (index > -1) {
			list.splice(index, 1);
		}
		this.eventSource.next(list);

		const setting = this.settingService.setting;
		const option = {
			accessKey: setting.qiniu.key,
			secretKey: setting.qiniu.secret,
			bucket: setting.qiniu.bucket,
			key: item.key
		};
		this.electronService.ipcRenderer.once(
			'request-delete-image-callback',
			(event, success: boolean) => {
				console.log('Delete img:  ' + item.key + " -> " + success)
			}
		);
		this.electronService.ipcRenderer.send('request-delete-image', option);
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
