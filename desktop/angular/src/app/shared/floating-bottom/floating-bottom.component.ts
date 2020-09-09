import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
	selector: 'app-floating-bottom',
	templateUrl: './floating-bottom.component.html',
	styleUrls: ['./floating-bottom.component.scss']
})
export class FloatingBottomComponent implements OnInit, AfterViewInit {

	constructor() {
	}

	showFloatingBottom = true;

	ngOnInit() {
	}

	ngAfterViewInit(): void {
		const element = document.getElementById('scroll-content');
		let preScrollTop = 0;
		element.addEventListener('scroll', () => {
			this.showFloatingBottom = preScrollTop < element.scrollTop;
			preScrollTop = element.scrollTop;
		});
	}
}
