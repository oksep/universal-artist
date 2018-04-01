import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import * as SimpleMDE from 'simplemde';

import {Seed} from '../seed/seed.component';

@Component({
	selector: 'app-edit-dialog',
	templateUrl: './edit-dialog.component.html',
	styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialog implements OnInit, AfterViewInit {
	@ViewChild('markdownEditor') simpleMDEElement: ElementRef;

	markdownEditor: SimpleMDE; // md 编辑器

	date = new Date(new Date().toISOString());

	seasons = [
		'normal',
		'large',
	];

	favoriteSeason: string = this.seasons[0];

	seed: Seed;

	constructor(public dialogRef: MatDialogRef<EditDialog>, @Inject(MAT_DIALOG_DATA) public data: Seed) {
		this.seed = data;
		this.favoriteSeason = this.seed.size;
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	ngOnInit() {
	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			// 初始化 markdown 编辑器
			this.markdownEditor = new SimpleMDE({
				element: this.simpleMDEElement.nativeElement,
				// showIcons: ["code", "table"]
			});

			// 编辑器监听
			this.markdownEditor.codemirror.on('change', () => {
				console.log(this.markdownEditor.value());
			});

			this.markdownEditor.value(`<embed src="https://www.youtube.com/embed/F9Bo89m2f6g" allowfullscreen="true" width="425" height="344">`);
		}, 100);
	}

}
