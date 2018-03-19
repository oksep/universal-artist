import {Component, OnInit} from '@angular/core';
import {UploadService} from '../shared/upload.service';
import {Settings} from '../setting/setting.modle';

@Component({
	selector: 'app-uiux',
	templateUrl: './uiux.component.html',
	styleUrls: ['./uiux.component.scss']
})
export class UiuxComponent implements OnInit {

	constructor(private uploadService: UploadService) {
	}

	ngOnInit() {
	}

	uploadConfig() {
	}

}
