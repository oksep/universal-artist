import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog, MatTableDataSource} from '@angular/material';

import {SeedService} from './seed.service';
import {animate, style, transition, trigger} from '@angular/animations';

import 'rxjs/Rx';
import {SeedEditor} from "./seed-editor/seed-editor.component";

@Component({
	selector: 'app-seed',
	templateUrl: './seed.component.html',
	styleUrls: ['./seed.component.scss'],
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
		let dialogRef = this.dialog.open(SeedEditor, {
			width: '100%',
			height: '100%',
			maxWidth: '100%',
			data: seed,
			panelClass: 'dialogPanelClass'
		});

		dialogRef.afterClosed().subscribe((result: { seed?: Seed, content?: string }) => {
			if (result && result.seed) {
				console.log('Seed Edit:', result);
				this.isLoading = true;
				const seed = result.seed;
				const content = result.content;
				const index = this.data.findIndex((item, index, array) => {
					return item.id == seed.id;
				});
				if (index > -1) {
					this.data[index] = seed;
				} else {
					this.data.push(seed);
				}
				this.seedService.updateSeedList(this.category, this.data)
					.flatMap(() => {
						return this.seedService.updateSeedContent(seed.id, content);
					})
					.subscribe(result => {
							console.log('Update seed result', result);
							this.ngZone.run(() => {
								this.dataSource.connect().next(this.data);
								this.dataSource.disconnect();
							});
						}, null , () => {
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
}