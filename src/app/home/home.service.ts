import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HomeService {

	constructor() {
	}

	getMsg() {
		this.getlist();
		return 'Hello Home Service';
	}

	getlist() {
		Observable.create(obs => {
			// todo
		});
	}
}
