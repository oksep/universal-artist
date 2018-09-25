import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import * as SimpleMDE from 'simplemde';

import {animate, style, transition, trigger} from '@angular/animations';

import {Feed} from "../feed.component";
import {FeedService} from "../feed.service";

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
export class FeedEditor implements OnInit, AfterViewInit {
	@ViewChild('markdownEditor') simpleMDEElement: ElementRef;

	markdownEditor: SimpleMDE; // md 编辑器

	sizes = ['normal', 'large',];

	feed: Feed = {} as Feed;

	content: string;

	loading: boolean = false;

	isNew: boolean = true;

	constructor(
		private cdr: ChangeDetectorRef,
		public feedService: FeedService,
		public dialogRef: MatDialogRef<FeedEditor>,
		@Inject(MAT_DIALOG_DATA) public data?: Feed) {

		this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
			startWith(null),
			map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));

		if (data != null) {
			this.feed = Object.assign({}, data);
			this.isNew = false
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
					setUpMarkdownEditor(this.content)
				})
		} else {
			this.feedService.requestFeedContent(this.feed.id)
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
		this.feedService.clearDraft().subscribe();
		this.dialogRef.close({
			feed: this.feed,
			content: this.content
		});
	}

	onSaveDraftClick() {
		this.feedService.saveDraft(this.feed, this.content).subscribe();
		this.dialogRef.close()
	}

	onCancelClick() {
		this.dialogRef.close();
	}

	get isFeedAvailable(): boolean {
		const isNotEmpty = (text) => {
			return typeof text != 'undefined' && text;
		};

		return isNotEmpty(this.feed.img)
			&& isNotEmpty(this.feed.createTime)
			&& isNotEmpty(this.feed.id)
			&& isNotEmpty(this.feed.title)
			&& isNotEmpty(this.feed.subTitle)
			&& isNotEmpty(this.feed.size);
	}

	//////////////////////////
	visible = true;
	selectable = true;
	removable = true;
	addOnBlur = false;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	fruitCtrl = new FormControl();
	filteredFruits: Observable<string[]>;
	fruits: string[] = ['Lemon'];
	allFruits: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

	@ViewChild('fruitInput') fruitInput: ElementRef;

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add our fruit
		if ((value || '').trim()) {
			this.fruits.push(value.trim());
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}

		this.fruitCtrl.setValue(null);
	}

	remove(fruit: string): void {
		const index = this.fruits.indexOf(fruit);

		if (index >= 0) {
			this.fruits.splice(index, 1);
		}
	}

	selected(event: MatAutocompleteSelectedEvent): void {
		this.fruits.push(event.option.viewValue);
		this.fruitInput.nativeElement.value = '';
		this.fruitCtrl.setValue(null);
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();
		return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
	}

}

export interface Fruit {
	name: string;
}
