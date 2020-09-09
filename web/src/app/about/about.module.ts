import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HttpClientModule} from '@angular/common/http';
import {MarkdownModule} from '../markdown/markdown.module';
import {AboutRoutingModule} from './about-routing.module';
import {AboutComponent} from './about.component';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    MarkdownModule,
    AboutRoutingModule
  ],
  declarations: [AboutComponent]
})
export class AboutModule {
}
