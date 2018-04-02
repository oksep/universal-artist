import {Component, NgZone, OnInit} from '@angular/core';
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

	name: string;

	displayedColumns = ['title', 'subTitle', 'createTime', 'operation'];

	data: Seed[] = [];

	dataSource = new MatTableDataSource(this.data);

	isLoading = true;

	constructor(private seedService: SeedService,
	            private route: ActivatedRoute,
	            private dialog: MatDialog,
	            private ngZone: NgZone) {
	}

	ngOnInit() {
		this.route.data.subscribe((data: { category: 'brand' | 'illustration' | 'uiux' }) => {
			this.category = data.category;
			this.fetchConfig();
		});
	}

	fetchConfig() {
		this.isLoading = true;
		this.seedService.requestSeedList(this.category)
			.delay(500)
			.subscribe((data: Seed[]) => {
				this.data = data;
				this.dataSource.connect().next(this.data);
				this.dataSource.disconnect();
			}, () => {
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
			});
	}

	onAddSeedClick() {
		this.openEditor(null);
	}

	onDeleteSeedClick(seed: Seed) {
		if (window.confirm('删除后将无法恢复！')) {
			let index = this.data.indexOf(seed);
			this.data.splice(index, 1);
			this.dataSource.connect().next(this.data);
			this.dataSource.disconnect();
			this.seedService.updateSeedList(this.category, this.data).subscribe();
		}
	}

	onEditSeedClick(seed: Seed) {
		this.openEditor(seed);
	}

	openEditor(seed?: Seed) {
		let dialogRef = this.dialog.open(EditDialog, {
			width: '100%',
			height: '100%',
			maxWidth: '100%',
			data: seed,
			panelClass: 'dialogPanelClass'
		});

		dialogRef.afterClosed().subscribe((seed?: Seed) => {
			console.log('Seed Edit:', seed);
			if (seed) {
				this.isLoading = true;
				const index = this.data.findIndex((item, index, array) => {
					return item.id == seed.id;
				});
				if (index > -1) {
					this.data[index] = seed;
				} else {
					this.data.push(seed);
				}
				this.seedService.updateSeedList(this.category, this.data)
					.subscribe(result => {
							console.log('Update seed list result:', result);
							this.ngZone.run(() => {
								this.dataSource.connect().next(this.data);
								this.dataSource.disconnect();
							});
						}, () => {
							this.ngZone.run(() => {
								this.isLoading = false;
							});
						}, () => {
							this.ngZone.run(() => {
								this.isLoading = false;
							});
						}
					);
			}
		});
	}
}

export interface Seed {
	category: 'brand' | 'illustration' | 'uiux';
	img: string;
	createTime: string;
	id: string;
	title: string;
	subTitle: string;
	size: 'normal' | 'large';
	content: string;
}