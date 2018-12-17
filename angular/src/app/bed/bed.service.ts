import {Injectable} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SettingService} from '../setting/setting.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BedService {
	private eventSource: BehaviorSubject<Array<ImageItem>> = new BehaviorSubject<Array<ImageItem>>([]);

	public bucketObservable = this.eventSource.asObservable();

	private orderByAsc = true;

	constructor(
		private electronService: ElectronService,
		private settingService: SettingService,
		private http: HttpClient,
	) {
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
		// const list = arg.data.items;
		// if (this.orderByAsc) {
		// 	list.sort(((a, b) => a.putTime - b.putTime));
		// } else {
		// 	list.sort(((a, b) => b.putTime - a.putTime));
		// }
		// this.eventSource.next(list);

		const url = 'http://dirty-bytes.septenary.cn/api/qiniu/force-bucket-list';
		const params = new HttpParams().set('timestamp', Date.now().toString());
		this.http.get(url, {params})
			.do(console.log)
			.catch(error => Observable.throw(error))
			.subscribe((result: { data: { items: ImageItem[] }, success: boolean }) => {
				console.log('Result', result);
				const list = result.data.items;
				if (this.orderByAsc) {
					list.sort(((a, b) => a.putTime - b.putTime));
				} else {
					list.sort(((a, b) => b.putTime - a.putTime));
				}
				this.eventSource.next(list);

			}, (error) => {
				console.error(error)
			});
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

		const url = 'http://dirty-bytes.septenary.cn/api/qiniu/force-delete-image?key=' + item.key;
		this.http.delete(url)
			.do(console.log)
			.catch(error => Observable.throw(error))
			.subscribe((result: any) => {
				console.log('Delete ok', result);
			}, (error) => {
				console.error(error)
			});
	}
}

export class ImageItem {
	fsize: number;
	hash: string;
	key: string;
	mimeType: string;
	putTime: number;
	status: number;
	type: number;
}