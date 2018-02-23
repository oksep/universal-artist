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
import {ThumbnailPipe} from './shared/thumbnail.pipe';
import {QiniuDatePipe} from './shared/qiniudate.pipe';
import {BounceSpinnerComponent} from './shared/bounce-spinner/bounce-spinner.component';
import {UploadButtonComponent} from './shared/upload/upload-button.component';
import {UploadService} from './shared/upload/upload.service';
import {HttpModule} from '@angular/http';

@NgModule({
  declarations: [
    AppComponent,
    SettingComponent,
    ConfigComponent,
    HomeComponent,
    BounceSpinnerComponent,
    UploadButtonComponent,
    ThumbnailPipe,
    QiniuDatePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    AppRouting,
    NgxElectronModule,
    CommonModule,
    HttpModule
  ],
  providers: [HomeService, UploadService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
