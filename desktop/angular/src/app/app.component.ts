import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	selectedIndex = 0;
	navs = [
		{router: '/feed', name: 'Feed'},
		{router: '/about', name: 'About'},
		{router: '/bed', name: 'ImageHost'},
		{router: '/setting', name: 'Setting'},
	];

	constructor() {
	}

	ngOnInit(): void {
		this.navs.forEach((value, index) => {
			if (window.location.hash.endsWith(value.router)) {
				this.selectedIndex = index;
			}
		});
	}
}
