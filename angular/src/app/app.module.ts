import './util/rxjs-ex';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SettingComponent} from './setting/setting.component';
import {AppRouting} from './app.routing';
import {RouterModule} from '@angular/router';
import {NgxElectronModule} from 'ngx-electron';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ThumbnailPipe} from './shared/thumbnail.pipe';
import {QiniuDatePipe} from './shared/qiniudate.pipe';
import {UploadService} from './shared/upload.service';
import {ThemeModule} from './theme/theme.module';
import {BedComponent} from './bed/bed.component';
import {UploadStatusComponent} from './bed/upload-status/upload-status.component';
import {BedService} from './bed/bed.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SettingService} from './setting/setting.service';
import {SeedComponent} from './seed/seed.component';
import {FloatingBottomComponent} from './shared/floating-bottom/floating-bottom.component';
import {SeedService} from './seed/seed.service';
import {HttpClientModule} from '@angular/common/http';
import {AboutComponent} from './about/about.component';
import {MarkdownModule} from "./markdown/markdown.module";
import {SeedEditor} from "./seed/seed-editor/seed-editor.component";
import {AboutEditorComponent} from './about/about-editor/about-editor.component';

@NgModule({
	declarations: [
		AppComponent,
		SettingComponent,
		ThumbnailPipe,
		QiniuDatePipe,
		BedComponent,
		UploadStatusComponent,
		SeedEditor,
		SeedComponent,
		FloatingBottomComponent,
		AboutComponent,
		AboutEditorComponent,
	],
	entryComponents: [
		SeedEditor,
		AboutEditorComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		RouterModule,
		AppRouting,
		NgxElectronModule,
		CommonModule,
		HttpClientModule,
		ThemeModule,
		BrowserAnimationsModule,
		MarkdownModule
	],
	providers: [UploadService, BedService, SettingService, SeedService],
	bootstrap: [AppComponent]
})
export class AppModule {
}
