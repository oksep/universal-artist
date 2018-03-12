import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'app-config',
	templateUrl: './config.component.html',
	styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
	// data = {
	// 	hello: 'this is lilay'
	// };
	data = '123';

	constructor() {
	}

	ngOnInit() {
		// Obse // rvable.create(it => {
		// 	it.next(require('./config.json'));
		// 	it.complete();
		// }).subscribe(json => {
		// 	this.data = json;
		// });
		// git push https://ryfthink:53059509yu@github.com/Ryfthink/azimghost
	}

}
