import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Component({
	selector: 'app-config',
	templateUrl: './config.component.html',
	styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
	// data = {
	// 	hello: 'this is lilay'
	// };
	data: string;

	constructor() {
	}

	ngOnInit() {
		Observable.create(it => {
			it.next(require('./config.json'));
			it.complete();
		}).subscribe(json => {
			this.data = json;
		});
	}

}
