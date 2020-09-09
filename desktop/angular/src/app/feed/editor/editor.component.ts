import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import * as SimpleMDE from 'simplemde';

import {animate, style, transition, trigger} from '@angular/animations';

import {Feed} from '../feed.component';
import {FeedService} from '../feed.service';
import {SettingService} from '../../setting/setting.service';

@Component({
	selector: 'app-feed-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss'],
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
export class FeedEditorComponent implements OnInit, AfterViewInit {

	@ViewChild('markdownEditor') simpleMDEElement: ElementRef;

	markdownEditor: SimpleMDE; // md 编辑器

	sizes = ['normal', 'large'];

	feed: Feed = {} as Feed;

	content: string;

	loading = false;

	isNew = true;

	constructor(
		public settingService: SettingService,
		private cdr: ChangeDetectorRef,
		public feedService: FeedService,
		public dialogRef: MatDialogRef<FeedEditorComponent>,
		@Inject(MAT_DIALOG_DATA) public data?: Feed) {

		if (data != null) {
			this.feed = Object.assign({}, data);
			this.isNew = false;
		} else {
			this.isNew = true;
		}
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
		this.loading = true;
		this.cdr.detectChanges();
		if (this.isNew) {
			this.feedService.getDraft().delay(500)
				.subscribe((draft: { feed: Feed, content: string }) => {
					this.loading = false;
					this.feed = draft.feed;
					this.content = draft.content;
					setUpMarkdownEditor(this.content);
				});
		} else {
			this.feedService.requestFeedContent(this.feed.id)
				.subscribe((content: string) => {
					setUpMarkdownEditor(content);
				}, () => {
					this.loading = false;
					setUpMarkdownEditor('');
				}, () => {
					this.loading = false;
				});
		}
	}

	onPublishClick() {
		this.feedService.clearDraft().subscribe();
		this.dialogRef.close({
			feed: this.feed,
			content: this.content
		});
	}

	onSaveDraftClick() {
		this.feedService.saveDraft(this.feed, this.content).subscribe();
		this.dialogRef.close();
	}

	onCancelClick() {
		this.dialogRef.close();
	}

	get isFeedAvailable(): boolean {
		const isNotEmpty = (text) => {
			return typeof text !== 'undefined' && text;
		};

		return isNotEmpty(this.feed.img)
			&& isNotEmpty(this.feed.createTime)
			&& isNotEmpty(this.feed.id)
			&& isNotEmpty(this.feed.title)
			&& isNotEmpty(this.feed.subTitle)
			&& isNotEmpty(this.feed.size);
	}
}
