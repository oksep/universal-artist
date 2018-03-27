import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
	selector: 'app-seed',
	templateUrl: './seed.component.html',
	styleUrls: ['./seed.component.scss']
})
export class SeedComponent implements OnInit {

	type: 'brand' | 'illustration' | 'uiux';

	constructor(private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.route.data.subscribe((data: { type: 'brand' | 'illustration' | 'uiux' }) => {
			this.type = data.type;
		});
	}

}
