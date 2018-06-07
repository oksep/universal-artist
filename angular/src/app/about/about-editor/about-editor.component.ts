import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import * as SimpleMDE from "simplemde";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
	selector: 'app-about-editor',
	templateUrl: './about-editor.component.html',
	styleUrls: ['./about-editor.component.scss']
})
export class AboutEditorComponent implements OnInit, AfterViewInit {

	@ViewChild('markdownEditor') simpleMDEElement: ElementRef;

	markdownEditor: SimpleMDE; // md 编辑器

	constructor(public dialogRef: MatDialogRef<AboutEditorComponent>,
							@Inject(MAT_DIALOG_DATA) public content: string
	) {
	}

	ngOnInit() {

	}

	ngAfterViewInit(): void {
		const setUpMarkdownEditor = (content: string) => {
			// 初始化 markdown 编辑器
			this.markdownEditor = new SimpleMDE({
				element: this.simpleMDEElement.nativeElement,
				// showIcons: ["code", "table"]
			});
			// 编辑器监听
			this.markdownEditor.codemirror.on('change', () => {
				this.content = this.markdownEditor.value();
			});
			this.markdownEditor.value(content);
		};
		setTimeout(() => {
			setUpMarkdownEditor(this.content);
		}, 500)
	}

	onPublishClick() {
		this.dialogRef.close(this.content);
	}

	onCancelClick() {
		this.dialogRef.close();
	}
}
