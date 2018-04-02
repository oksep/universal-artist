import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Settings} from './setting.modle';

@Injectable()
export class SettingService {

	private _setting: Settings;

	constructor() {
		const json = localStorage.getItem('settings');
		this._setting = json != null ? JSON.parse(json) as Settings : new Settings();
	}

	get domain(): string {
		return environment.production ? this._setting.qiniu.domain : this._setting.qiniu.devDomain;
	}

	get prodDomain(): string {
		return this._setting.qiniu.domain;
	}

	get setting(): Settings {
		return this._setting;
	}

	set setting(settings: Settings) {
		this._setting = settings;
		localStorage.setItem('settings', JSON.stringify(settings));
	}
}
