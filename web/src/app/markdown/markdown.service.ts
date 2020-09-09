import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';

import * as  marked from 'marked';

import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class MarkdownService {
  private _renderer: any = new marked.Renderer();

  constructor(private http: HttpClient) {
    this.extendRenderer();
    this.setMarkedOptions({});
  }

  // get the content from remote resource
  getContent(path: string): Observable<any> {
    const params = new HttpParams().set('timestamp', Date.now().toString());
    return this.http.get(path, {responseType: 'text', params: params})
      .pipe(
        tap(console.log),
        catchError(this.handleError('requestSeed', {}))
      );
  }

  public get renderer() {
    return this._renderer;
  }

  public setMarkedOptions(options: any) {
    options = Object.assign({
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    }, options);
    options.renderer = this._renderer;
    marked.setOptions(options);
  }

  // comple markdown to html
  public compile(data: string) {
    return marked(data);
  }

  // handle error
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

  // extend marked render to support todo checkbox
  private extendRenderer() {
    this._renderer.listitem = function (text: string) {
      if (/^\s*\[[x ]\]\s*/.test(text)) {
        const t = text
          .replace(/^\s*\[ \]\s*/,
            '<input type="checkbox" style=" vertical-align: middle; margin: 0 0.2em 0.25em -1.6em; font-size: 16px; " disabled> ')
          .replace(/^\s*\[x\]\s*/,
            '<input type="checkbox" style=" vertical-align: middle; margin: 0 0.2em 0.25em -1.6em; font-size: 16px; " checked disabled> ');
        return '<li style="list-style: none">' + t + '</li>';
      } else {
        return '<li>' + text + '</li>';
      }
    };
    this._renderer.image = function (href: string, title: string, text: string) {
      const alt = text ? `<br><div class="img-alt">${text}</div>` : '';
      return `
        <div style="text-align: center" class="img-container"><img src="${href}">
          ${alt}
        </div>
      `;
    };
    this._renderer.link = function (href: string, title: string, text: string) {
      return `
        <a target="_blank" href="${href}">${text}</a>
      `;
    };
  }
}
