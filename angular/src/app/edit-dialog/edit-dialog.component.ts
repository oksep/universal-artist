import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import * as SimpleMDE from 'simplemde';

import {Seed} from '../seed/seed.component';
import Random from '../util/random';
import {SeedService} from "../seed/seed.service";

import {animate, style, transition, trigger} from '@angular/animations';

@Component({
	selector: 'app-edit-dialog',
	templateUrl: './edit-dialog.component.html',
	styleUrls: ['./edit-dialog.component.scss'],
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({
					opacity: 0
				}),
				animate('0.25s ease-in-out', style({
					opacity: 1
				}))
			]),
			transition(':leave', [
				style({
					opacity: 1
				}),
				animate('0.25s ease-in-out', style({
					opacity: 0
				}))
			])
		])
	]
})
export class EditDialog implements OnInit, AfterViewInit {
	@ViewChild('markdownEditor') simpleMDEElement: ElementRef;

	markdownEditor: SimpleMDE; // md 编辑器

	sizes = ['normal', 'large',];

	seed: Seed;

	content: string;

	loading: boolean = false;

	isNew: boolean = true;

	constructor(
		private cdr: ChangeDetectorRef,
		public seedService: SeedService,
		public dialogRef: MatDialogRef<EditDialog>,
		@Inject(MAT_DIALOG_DATA) public data?: Seed) {
		if (data != null) {
			this.seed = Object.assign({}, data);
			this.isNew = false
		} else {
			this.seed = {
				size: 'normal',
				createTime: new Date().toISOString(),
				id: Random.genHash()
			} as Seed;
			this.isNew = true;
		}
	}

	ngOnInit() {
	}

	ngAfterViewInit(): void {
		const setUpMarkdownEditor = (content: String) => {
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
		this.loading = true;
		this.cdr.detectChanges();
		if (this.isNew) {
			setTimeout(() => {
				this.loading = false;
				setUpMarkdownEditor("");
			}, 500)
		} else {
			this.seedService.requestSeedContent(this.seed.id)
				.subscribe((content: string) => {
					setUpMarkdownEditor(content);
				}, () => {
					this.loading = false;
					setUpMarkdownEditor("");
				}, () => {
					this.loading = false;
				});
		}
	}

	onPublishClick() {
		this.dialogRef.close({
			seed: this.seed,
			content: this.content
		});
	}

	onCancelClick() {
		this.dialogRef.close();
	}

	get isSeedAvailable(): boolean {
		const isNotEmpty = (text) => {
			return typeof text != 'undefined' && text;
		};

		return isNotEmpty(this.seed.img)
			&& isNotEmpty(this.seed.createTime)
			&& isNotEmpty(this.seed.id)
			&& isNotEmpty(this.seed.title)
			&& isNotEmpty(this.seed.subTitle)
			&& isNotEmpty(this.seed.size);
	}
}
