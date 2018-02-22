import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {Settings} from '../setting/setting.modle';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	data: Array<Item> = null;

	listener = (event, arg) => {
		this.data = arg.data.items;
		this.cdRef.detectChanges();
		console.log('Reply: ', this.data);
	};

	constructor(private electronService: ElectronService, private cdRef: ChangeDetectorRef) {
	}

	ngOnInit() {
		const setting = Settings.loadSetting();

		const option = {
			accessKey: setting.qiniu.key,
			secretKey: setting.qiniu.secret,
			bucket: setting.qiniu.bucket,
			prefix: setting.qiniu.prefix,
			limit: 10
		};

		this.electronService.ipcRenderer.send('request-bucket-list', option);
		this.electronService.ipcRenderer.on('request-bucket-list-callback', this.listener);
	}

	ngOnDestroy() {
		this.electronService.ipcRenderer.removeListener('request-bucket-list-callback', this.listener);
	}

	getDate(millisecond: number) {
		return new Date(millisecond / 10000);
	}
}

class Item {
	size: number;
	hash: string;
	key: string;
	mimeType: string;
	putTime: number;
	status: number;
	type: number;
}
