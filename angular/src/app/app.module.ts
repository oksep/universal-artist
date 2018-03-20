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
import {HttpModule} from '@angular/http';
import {ThemeModule} from './theme/theme.module';
import {BedComponent} from './bed/bed.component';
import {IllustrationComponent} from './illustration/illustration.component';
import {BrandComponent} from './brand/brand.component';
import {UiuxComponent} from './uiux/uiux.component';
import {UploadStatusComponent} from './bed/upload-status/upload-status.component';
import {BedService} from './bed/bed.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    SettingComponent,
    ThumbnailPipe,
    QiniuDatePipe,
    BedComponent,
    IllustrationComponent,
    BrandComponent,
    UiuxComponent,
    UploadStatusComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    AppRouting,
    NgxElectronModule,
    CommonModule,
    HttpModule,
    ThemeModule,
	  BrowserAnimationsModule
  ],
  providers: [UploadService, BedService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
