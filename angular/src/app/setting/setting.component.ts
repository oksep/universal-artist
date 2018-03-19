import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Settings} from './setting.modle';
import {BedService} from '../bed/bed.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  settings = new Settings();

  @ViewChild('settingForm') form: NgForm;

  constructor(private homeService: BedService) {
  }

  ngOnInit() {
    this.settings = Settings.loadSetting();
  }

  saveSetting() {
    Settings.saveSetting(this.settings);
    this.homeService.ensureBucketList();
    if (this.form) {
      const qiniu = this.settings.qiniu;
      const github = this.settings.github;
      this.form.resetForm({
        key: qiniu.key,
        secret: qiniu.secret,
        bucket: qiniu.bucket,
        prefix: qiniu.prefix,
        name: github.name,
        password: github.password
      });
    }
  }
}
