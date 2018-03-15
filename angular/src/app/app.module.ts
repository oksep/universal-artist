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
import {UploadButtonComponent} from './home/upload/upload-button.component';
import {UploadService} from './home/upload/upload.service';
import {HttpModule} from '@angular/http';
import {ThemeModule} from './theme/theme.module';
import { BedComponent } from './bed/bed.component';
import { IllustrationComponent } from './illustration/illustration.component';
import { BrandComponent } from './brand/brand.component';
import { UiuxComponent } from './uiux/uiux.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingComponent,
    ConfigComponent,
    HomeComponent,
    BounceSpinnerComponent,
    UploadButtonComponent,
    ThumbnailPipe,
    QiniuDatePipe,
    BedComponent,
    IllustrationComponent,
    BrandComponent,
    UiuxComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    AppRouting,
    NgxElectronModule,
    CommonModule,
    HttpModule,
    ThemeModule
  ],
  providers: [HomeService, UploadService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
