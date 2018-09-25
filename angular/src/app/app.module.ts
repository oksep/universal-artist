import './util/rxjs-ex';

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SettingComponent} from './setting/setting.component';
import {AppRouting} from './app.routing';
import {RouterModule} from '@angular/router';
import {NgxElectronModule} from 'ngx-electron';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import {FloatingBottomComponent} from './shared/floating-bottom/floating-bottom.component';
import {HttpClientModule} from '@angular/common/http';
import {AboutComponent} from './about/about.component';
import {MarkdownModule} from "./markdown/markdown.module";
import {AboutEditorComponent} from './about/about-editor/about-editor.component';
import {LazyLoadImagesModule} from "ngx-lazy-load-images";
import {ImgAppearDirective} from "./shared/img-appear.directive";

import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import {FeedComponent} from './feed/feed.component';
import {FeedService} from "./feed/feed.service";
import {FeedEditor} from "./feed/editor/editor.component";

@NgModule({
	declarations: [
		AppComponent,
		SettingComponent,
		ThumbnailPipe,
		QiniuDatePipe,
		BedComponent,
		UploadStatusComponent,
		FloatingBottomComponent,
		AboutComponent,
		AboutEditorComponent,
		ImgAppearDirective,
		FeedComponent,
		FeedEditor
	],
	entryComponents: [
		FeedEditor,
		AboutEditorComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		AppRouting,
		NgxElectronModule,
		CommonModule,
		HttpClientModule,
		ThemeModule,
		BrowserAnimationsModule,
		MarkdownModule,
		LazyLoadImagesModule,

		MatIconModule,
		MatChipsModule,
		MatFormFieldModule,
		MatAutocompleteModule
	],
	providers: [UploadService, BedService, SettingService, FeedService],
	bootstrap: [AppComponent]
})
export class AppModule {
}
