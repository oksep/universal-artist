import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {MatDialog, MatTableDataSource} from '@angular/material';

import {MarkdownEditorDialog} from '../markdown-dialog/markdown-dialog.component';
import {SeedService} from './seed.service';

@Component({
	selector: 'app-seed',
	templateUrl: './seed.component.html',
	styleUrls: ['./seed.component.scss']
})
export class SeedComponent implements OnInit {

	category: 'brand' | 'illustration' | 'uiux';

	animal: string;

	name: string;

	displayedColumns = ['img', 'createTime', 'title', 'subTitle', 'operation'];

	data: Seed[] = [];

	dataSource = new MatTableDataSource(this.data);

	constructor(private seedService: SeedService, private route: ActivatedRoute, private dialog: MatDialog) {
	}

	ngOnInit() {
		this.route.data.subscribe((data: { category: 'brand' | 'illustration' | 'uiux' }) => {
			this.category = data.category;
			this.fetchConfig();
		});
	}

	fetchConfig() {
		this.seedService.requestConfig(this.category).subscribe(data => {
			console.log('AAA', data);
			this.data = data as Seed[];
			this.dataSource.connect().next(this.data);
			this.dataSource.disconnect();
		});
	}

	onAddSeedClick() {
		// this.data.push(
		// 	{position: this.dataSource.data.length + 1, name: this.category, weight: 1.0079, symbol: 'H'},
		// );
		// this.dataSource.connect().next(this.data);
		// this.dataSource.disconnect();
	}

	onDeleteSeedClick(seed: any) {
		if (window.confirm('删除后将无法恢复！')) {
			let index = this.data.indexOf(seed);
			this.data.splice(index, 1);
			this.dataSource.connect().next(this.data);
		}
	}

	onEditSeedClick(seed: any) {
		this.onOpenMarkdownDialogClick();
	}

	onOpenMarkdownDialogClick() {
		let dialogRef = this.dialog.open(MarkdownEditorDialog, {
			width: '100%',
			height: '100%',
			maxWidth: '100%',
			data: {name: this.name, animal: this.animal},
			panelClass: 'dialogPanelClass'
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
			this.animal = result;
		});
	}
}

interface Seed {
	category: 'brand' | 'illustration' | 'uiux';
	img: string;
	createTime: string;
	updateTime: string;
	id: string;
	title: string;
	subTitle: string;
	size: string;
}