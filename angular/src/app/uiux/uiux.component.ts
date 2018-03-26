import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UploadService} from '../shared/upload.service';
import * as SimpleMDE from 'simplemde';

// import * as SimpleMDE from 'simplemde';

@Component({
	selector: 'app-uiux',
	templateUrl: './uiux.component.html',
	styleUrls: ['./uiux.component.scss']
})
export class UiuxComponent implements OnInit {

	data: Array<Seed> = Array(10);

	@ViewChild('markdownEditor') simpleMDE: ElementRef;

	markdownEditor: SimpleMDE; // md 编辑器

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

		// 初始化 markdown 编辑器
		this.markdownEditor = new SimpleMDE({
			element: this.simpleMDE.nativeElement,
			// showIcons: ["code", "table"]
		});

		// 编辑器监听
		this.markdownEditor.codemirror.on('change', () => {
			console.log(this.markdownEditor.value());
		});
	}

	uploadConfig() {
	}

}
