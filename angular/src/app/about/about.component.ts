import {Component, NgZone, OnInit} from '@angular/core';
import {SeedService} from "../seed/seed.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {MatDialog} from "@angular/material";
import {AboutEditorComponent} from "./about-editor/about-editor.component";

@Component({
	selector: 'app-about',
	templateUrl: './about.component.html',
	styleUrls: ['./about.component.scss'],
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
export class AboutComponent implements OnInit {

	content = '';

	isLoading: boolean = false;

	constructor(
		private ngZone: NgZone,
		private seedService: SeedService,
		private dialog: MatDialog) {
	}

	ngOnInit() {
		this.isLoading = true;
		this.seedService.requestAboutMeContent()
			.subscribe((content: string) => {
				this.content = content;
			}, () => {
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
			});
	}


	openEditor(content: string) {
		let dialogRef = this.dialog.open(AboutEditorComponent, {
			width: '100%',
			height: '100%',
			maxWidth: '100%',
			data: content,
			panelClass: 'dialogPanelClass'
		});

		dialogRef.afterClosed().subscribe(content => {
			if (content) {
				this.isLoading = true;
				this.seedService.updateAboutMeContent(content)
					.subscribe(() => {
						this.ngZone.run(() => {
							this.content = content;
						});
					}, (error) => {
						console.log('update about-me failed', error);
					}, () => {
						this.ngZone.run(() => {
							this.isLoading = false;
						});
					});
			}
		});
	}

}
