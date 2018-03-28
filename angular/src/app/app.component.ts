import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	selectedIndex: Number = 0;
	navs = [
		{router: '/bed', name: 'ImageHost'},
		{router: '/brand', name: 'Brand'},
		{router: '/illustration', name: 'Illustration'},
		{router: '/uiux', name: 'Ui/Ux'},
		{router: '/setting', name: 'Setting'},
	];

	constructor(private router: Router, private activatedRoute: ActivatedRoute) {

	}

	ngOnInit(): void {
		this.activatedRoute.url.subscribe(param => {
			console.log('Param:', param);
		});
		console.log(this.router.url)
	}
}
