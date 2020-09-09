import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ShopComponent} from './shop/shop.component';
import {ContactComponent} from './contact/contact.component';
import {LazyLoadImagesModule} from 'ngx-lazy-load-images';
import {ImgAppearDirective} from './util/img-appear.directive';
import {TouchHoverDirective} from './util/touch-hover.directive';
import {BackTopComponent} from './util/back-top/back-top.component';
import {QiniuImgPipe} from './util/qiniu-img.pipe';
import {FormsModule} from '@angular/forms';
import {FeedComponent} from './feed/feed.component';
import { ItemComponent } from './feed/item/item.component';
import {AppService} from './app.service';

@NgModule({
  declarations: [
    AppComponent,
    ShopComponent,
    ContactComponent,
    BackTopComponent,
    ImgAppearDirective,
    TouchHoverDirective,
    QiniuImgPipe,
    FeedComponent,
    ItemComponent
  ],
  imports: [
    LazyLoadImagesModule,
    HttpClientModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
  ],
  providers: [
    AppService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
