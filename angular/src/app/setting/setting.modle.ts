export class Settings {
	github = new Github();
	qiniu = new Qiniu();

	static loadSetting() {
		const json = localStorage.getItem('settings');
		if (json != null) {
			return JSON.parse(json) as Settings;
		} else {
			return new Settings();
		}
	}

	static saveSetting(settings: Settings) {
		localStorage.setItem('settings', JSON.stringify(settings));
	}
}

class Github {
	name = '';
	password = '';
}

class Qiniu {
	key = '';
	secret = '';
	bucket = '';
	prefix = '';
}
