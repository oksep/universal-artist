import './util/rxjs-ex';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SettingComponent} from './setting/setting.component';
import {ConfigComponent} from './config/config.component';
import {AppRouting} from './app.routing';
import {RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {NgxElectronModule} from 'ngx-electron';
import {FormsModule} from '@angular/forms';
import {HomeService} from './home/home.service';
import {CommonModule} from '@angular/common';

@NgModule({
	declarations: [
		AppComponent,
		SettingComponent,
		ConfigComponent,
		HomeComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		RouterModule,
		AppRouting,
		NgxElectronModule,
		CommonModule
	],
	providers: [HomeService],
	bootstrap: [AppComponent]
})
export class AppModule {
}
