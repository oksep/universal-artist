import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatTableDataSource} from '@angular/material';

import {EditDialog} from '../edit-dialog/edit-dialog.component';
import {SeedService} from './seed.service';
import AnimateHelper from '../util/animation';

@Component({
	selector: 'app-seed',
	templateUrl: './seed.component.html',
	styleUrls: ['./seed.component.scss'],
	animations: [AnimateHelper.fadeInOut]
})
export class SeedComponent implements OnInit {

	category: 'brand' | 'illustration' | 'uiux';

	animal: string;

	name: string;

	displayedColumns = ['title', 'subTitle', 'createTime', 'operation'];

	data: Seed[] = [];

	dataSource = new MatTableDataSource(this.data);

	isLoading = true;

	constructor(private seedService: SeedService, private route: ActivatedRoute, private dialog: MatDialog) {
	}

	ngOnInit() {
		this.route.data.subscribe((data: { category: 'brand' | 'illustration' | 'uiux' }) => {
			this.category = data.category;
			this.fetchConfig();
		});
	}

	fetchConfig() {
		this.isLoading = true;
		this.seedService.requestConfig(this.category)
			.delay(500)
			.subscribe((data: Seed[]) => {
				console.log('AAA', data);
				this.data = data;// [...data, ...data, ...data, ...data, ...data, ...data, ...data];
				this.dataSource.connect().next(this.data);
				this.dataSource.disconnect();
			}, () => {
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
			});
	}

	onAddSeedClick() {
		// this.data.push(
		// 	{position: this.dataSource.data.length + 1, name: this.category, weight: 1.0079, symbol: 'H'},
		// );
		// this.dataSource.connect().next(this.data);
		// this.dataSource.disconnect();
		this.data.push(this.data[0]);
		this.seedService.uploadConfig('brand', this.data)
	}

	onDeleteSeedClick(seed: Seed) {
		if (window.confirm('删除后将无法恢复！')) {
			let index = this.data.indexOf(seed);
			this.data.splice(index, 1);
			this.dataSource.connect().next(this.data);
		}
	}

	onEditSeedClick(seed: Seed) {
		this.onOpenMarkdownDialogClick(seed);
	}

	onOpenMarkdownDialogClick(seed: Seed) {
		let dialogRef = this.dialog.open(EditDialog, {
			width: '100%',
			height: '100%',
			maxWidth: '100%',
			data: seed,
			panelClass: 'dialogPanelClass'
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
			this.animal = result;
		});
	}
}

export interface Seed {
	category: 'brand' | 'illustration' | 'uiux';
	img: string;
	createTime: string;
	updateTime: string;
	id: string;
	title: string;
	subTitle: string;
	size: string;
}