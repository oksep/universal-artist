import {Component, OnInit} from '@angular/core';
import {UploadService} from '../shared/upload.service';

@Component({
	selector: 'app-uiux',
	templateUrl: './uiux.component.html',
	styleUrls: ['./uiux.component.scss']
})
export class UiuxComponent implements OnInit {

	data: Array<Seed> = Array(10);

	constructor(private uploadService: UploadService) {
	}

	ngOnInit() {
		this.data.fill(
			{
				title: 'Hello',
				subtile: 'it`s me',
				size: 'normal',
				category: 'uiux',
				time: 1123897987981230,
				hash: '0sdj123hoissv12',
			}
		);
	}

	uploadConfig() {
	}

}
