import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {HomeService, ImageItem} from '../home/home.service';

@Component({
	selector: 'app-bed',
	templateUrl: './bed.component.html',
	styleUrls: ['./bed.component.scss']
})
export class BedComponent implements OnInit, OnDestroy, AfterViewInit {

	data: Array<ImageItem> = [];

	sub = null;

	@Input() position: number = 400;
	@Input() showSpeed: number = 500;
	@Input() moveSpeed: number = 200;

	text: number = 0;

	constructor(private cdRef: ChangeDetectorRef, private homeService: HomeService) {
	}

	ngOnInit(): void {
		this.sub = this.homeService.bucketObservable.subscribe(
			(list: Array<ImageItem>) => {
				this.data = list;
				this.cdRef.detectChanges();
			},
			error => {
				this.data = [];
				console.error(error);
			}
		);
	}

	ngOnDestroy() {
		if (this.sub != null) {
			this.sub.unsubscribe();
		}
	}

	showButton = true;

	ngAfterViewInit(): void {
		const element = document.getElementById('scroll-content');
		let preScrollTop = 0;
		element.addEventListener('scroll', () => {
			this.showButton = preScrollTop < element.scrollTop;
			preScrollTop = element.scrollTop;
		});
	}

	onImgClick(key: string) {
		const url = environment.domain + key;
		this.homeService.openUrlInBrowser(url);
	}

	onSortClick() {
		this.homeService.changeOrder();
	}

	get order() {
		return this.homeService.order;
	}
}