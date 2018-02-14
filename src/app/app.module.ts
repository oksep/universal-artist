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

@NgModule({
	declarations: [
		AppComponent,
		SettingComponent,
		ConfigComponent,
		HomeComponent
	],
	imports: [
		BrowserModule,
		RouterModule,
		AppRouting,
		NgxElectronModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}
