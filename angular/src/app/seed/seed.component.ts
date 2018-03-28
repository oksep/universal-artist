import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {MatDialog, MatTableDataSource} from '@angular/material';

import {MarkdownEditorDialog} from '../markdown-dialog/markdown-dialog.component';

@Component({
	selector: 'app-seed',
	templateUrl: './seed.component.html',
	styleUrls: ['./seed.component.scss']
})
export class SeedComponent implements OnInit {

	type: 'brand' | 'illustration' | 'uiux';

	animal: string;

	name: string;

	displayedColumns = ['position', 'name', 'weight', 'symbol', 'symbol2'];

	dataSource = new MatTableDataSource(ELEMENT_DATA);

	constructor(private route: ActivatedRoute, private dialog: MatDialog) {
	}

	ngOnInit() {
		this.route.data.subscribe((data: { type: 'brand' | 'illustration' | 'uiux' }) => {
			this.type = data.type;
		});
	}

	onAddSeedClick() {
		ELEMENT_DATA.push(
			{position: this.dataSource.data.length + 1, name: this.type, weight: 1.0079, symbol: 'H'},
		);
		this.dataSource.connect().next(ELEMENT_DATA);
		this.dataSource.disconnect()
	}

	onDeleteSeedClick(seed: any) {
		// ELEMENT_DATA.shift();
		let index = ELEMENT_DATA.indexOf(seed);
		ELEMENT_DATA.splice(index, 1);
		this.dataSource.connect().next(ELEMENT_DATA);
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


export interface Element {
	name: string;
	position: number;
	weight: number;
	symbol: string;
}

const ELEMENT_DATA: Element[] = [
	{position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
	{position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
];

class Seed {
	title: string;
	subtile: string;
	size: 'large' | 'normal';
	category: 'brand' | 'illustration' | 'uiux';
	time: number;
	hash: string;
}