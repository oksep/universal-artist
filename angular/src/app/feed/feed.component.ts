import {Component, NgZone, OnInit} from '@angular/core';
import {FeedService} from "./feed.service";
import {FeedEditor} from "../feed/editor/editor.component";
import {Feed} from "../feed/feed.component";
import {MatDialog, MatTableDataSource} from "@angular/material";
import {ActivatedRoute} from "@angular/router";
import {animate, style, transition, trigger} from '@angular/animations';
import 'rxjs/Rx';

@Component({
	selector: 'app-feed',
	templateUrl: './feed.component.html',
	styleUrls: ['./feed.component.scss'],
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
export class FeedComponent implements OnInit {

	value = 'null';

	data: Feed[] = [];

	displayedColumns = ['title', 'tag', 'subTitle', 'createTime', 'operation'];

	dataSource = new MatTableDataSource(this.data);

	isLoading = true;

	constructor(private feedService: FeedService,
	            private route: ActivatedRoute,
	            private dialog: MatDialog,
	            private ngZone: NgZone) {
	}

	ngOnInit() {
		this.isLoading = true;
		this.feedService.requestFeedList()
			.subscribe((data: Feed[]) => {
				this.data = data;
				this.dataSource.connect().next(this.data);
				this.dataSource.disconnect();
			}, () => {
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
			});
	}


	onAddFeedClick() {
		this.openEditor(null);
	}

	onDeleteFeedClick(feed: Feed) {
		if (window.confirm('删除后将无法恢复！')) {
			let index = this.data.indexOf(feed);
			this.data.splice(index, 1);
			this.dataSource.connect().next(this.data);
			this.dataSource.disconnect();
			this.feedService.updateFeedList(this.data).subscribe();
		}
	}

	onEditFeedClick(feed: Feed) {
		this.openEditor(feed);
	}

	openEditor(feed?: Feed) {
		let dialogRef = this.dialog.open(FeedEditor, {
			width: '100%',
			height: '100%',
			maxWidth: '100%',
			data: feed,
			panelClass: 'dialogPanelClass'
		});

		dialogRef.afterClosed().subscribe((result: { feed?: Feed, content?: string }) => {
			if (result && result.feed) {
				console.log('Feed Edit:', result);
				this.isLoading = true;
				const feed = result.feed;
				const content = result.content;
				const index = this.data.findIndex((item, index, array) => {
					return item.id == feed.id;
				});
				if (index > -1) {
					this.data[index] = feed;
				} else {
					this.data.push(feed);
				}
				this.data = this.feedService.sortFeedListByDate(this.data);

				this.feedService.updateFeedList(this.data)
					.flatMap(() => {
						return this.feedService.updateFeedContent(feed.id, content);
					})
					.subscribe(result => {
							console.log('Update feed result', result);
							this.ngZone.run(() => {
								this.dataSource.connect().next(this.data);
								this.dataSource.disconnect();
							});
						}, null, () => {
							this.ngZone.run(() => {
								this.isLoading = false;
							});
						}
					);
			}
		});
	}
}

export interface Feed {
	img: string;
	createTime: string;
	id: string;
	title: string;
	subTitle: string;
	size: 'normal' | 'large';
}
