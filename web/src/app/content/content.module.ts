import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ContentRoutingModule} from './content-routing.module';
import {HttpClientModule} from '@angular/common/http';
import {ContentComponent} from './content.component';
import {MarkdownModule} from '../markdown/markdown.module';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    MarkdownModule,
    ContentRoutingModule
  ],
  declarations: [ContentComponent]
})
export class ContentModule {
}
