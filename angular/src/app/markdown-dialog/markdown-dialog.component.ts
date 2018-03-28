import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import * as SimpleMDE from 'simplemde';

@Component({
	selector: 'app-markdown-dialog',
	templateUrl: './markdown-dialog.component.html',
	styleUrls: ['./markdown-dialog.component.scss']
})
export class MarkdownEditorDialog implements OnInit, AfterViewInit {
	@ViewChild('markdownEditor') simpleMDE: ElementRef;

	markdownEditor: SimpleMDE; // md 编辑器

	constructor(public dialogRef: MatDialogRef<MarkdownEditorDialog>,
	            @Inject(MAT_DIALOG_DATA) public data: any) {
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	ngOnInit() {
	}

	ngAfterViewInit(): void {
		setTimeout(()=>{
			// 初始化 markdown 编辑器
			this.markdownEditor = new SimpleMDE({
				element: this.simpleMDE.nativeElement,
				// showIcons: ["code", "table"]
			});

			// 编辑器监听
			this.markdownEditor.codemirror.on('change', () => {
				console.log(this.markdownEditor.value());
			});
		}, 1000)
	}

}
