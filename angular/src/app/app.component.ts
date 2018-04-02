import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	selectedIndex: Number = 0;
	navs = [
		{router: '/brand', name: 'Brand'},
		{router: '/illustration', name: 'Illustration'},
		{router: '/uiux', name: 'Ui/Ux'},
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
