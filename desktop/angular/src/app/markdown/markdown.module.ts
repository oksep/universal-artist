import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {MarkdownComponent} from './markdown.component';
import {MarkdownService} from './markdown.service';
import {MarkdownConfig} from './markdown.config';
import {HttpClientModule} from '@angular/common/http';
import {GithubComponent} from './github/github.component';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [MarkdownComponent, GithubComponent],
  providers: [MarkdownService],
  exports: [MarkdownComponent, GithubComponent],
})
export class MarkdownModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: MarkdownModule,
      providers: [MarkdownConfig]
    };
  }
}
