import {Component, OnInit} from '@angular/core';

import {MatDialog} from '@angular/material';
import {MarkdownEditorDialog} from '../markdown-dialog/markdown-dialog.component';

@Component({
	selector: 'app-uiux',
	templateUrl: './uiux.component.html',
	styleUrls: ['./uiux.component.scss']
})
export class UiuxComponent implements OnInit {

	data: Array<Seed> = Array(10);

	animal: string;
	name: string;

	constructor(public dialog: MatDialog) {
	}

	ngOnInit() {
		this.data.fill(
			{
				title: 'Hello',
				subtile: 'it`s me',
				size: 'normal',
				category: 'uiux',
				time: 1123897987981230,
				hash: '0sdj123hoissv12',
			}
		);
	}

	openDialog(): void {
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
