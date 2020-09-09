import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {UploadService} from '../shared/upload.service';
import {BedService, ImageItem} from './bed.service';
import {SettingService} from '../setting/setting.service';
import {ElectronService} from 'ngx-electron';

@Component({
	selector: 'app-bed',
	templateUrl: './bed.component.html',
	styleUrls: ['./bed.component.scss']
})
export class BedComponent implements OnInit, OnDestroy, AfterViewInit {

	data: Array<ImageItem> = [];

	sub = null;

	text = 0;

	constructor(private cdRef: ChangeDetectorRef,
	            private homeService: BedService,
	            private electronService: ElectronService,
	            private uploadService: UploadService,
	            private settingService: SettingService) {
	}

	ngOnInit(): void {
		this.sub = this.homeService.bucketObservable.subscribe(
			(list: Array<ImageItem>) => {
				this.data = list;
				this.cdRef.detectChanges();
			},
			error => {
				this.data = [];
				console.error(error);
			}
		);
	}

	ngOnDestroy() {
		if (this.sub != null) {
			this.sub.unsubscribe();
		}
	}

	ngAfterViewInit(): void {
	}

	onPreviewImgClick(key: string) {
		const url = this.settingService.prodDomain + key;
		this.homeService.openUrlInBrowser(url);
	}

	onCopyImgLinkClick(key: string) {
		const url = this.settingService.prodDomain + key;
		this.electronService.clipboard.writeText(url);
	}

	onDeleteImgClick(item: ImageItem) {
		if (window.confirm('确定要删除吗？')) {
			this.homeService.removeImageItem(item);
		}
	}

	onSortClick() {
		this.homeService.changeOrder();
	}

	get order() {
		return this.homeService.order;
	}

	handleInputChange(e: DragEvent) {
		const selectFiles = e.dataTransfer ? e.dataTransfer.files : (<HTMLInputElement>e.target).files;
		const imageFiles = [];
		for (const key of Object.keys(selectFiles)) {
			const file = selectFiles[key];
			if (file.type.startsWith('image/')) {
				imageFiles.push(file);
			}
		}
		console.log(imageFiles);
		this.uploadService.uploadFiles(imageFiles);
	}
}
