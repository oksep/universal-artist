import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Settings} from './setting.modle';
import {BedService} from '../bed/bed.service';
import {SettingService} from './setting.service';

@Component({
	selector: 'app-setting',
	templateUrl: './setting.component.html',
	styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

	settings: Settings;

	@ViewChild('settingForm') form: NgForm;

	constructor(private homeService: BedService, private settingService: SettingService) {
		this.settings = this.settingService.setting;
	}

	ngOnInit() {
	}

	saveSetting() {
		this.settingService.setting = this.settings;
		this.homeService.ensureBucketList();
		if (this.form) {
			const qiniu = this.settings.qiniu;
			this.form.resetForm({
				domain: qiniu.domain,
				key: qiniu.key,
				secret: qiniu.secret,
				bucket: qiniu.bucket,
				devDomain: qiniu.devDomain
			});
		}
	}
}
