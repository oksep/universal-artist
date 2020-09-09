import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError, map, tap, flatMap} from 'rxjs/operators';
import {FeedModel} from './feed/feed.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private seedCache = {
    'brand': [],
    'illustration': [],
    'uiux': []
  };

  private feedList: FeedModel[] = null;

  constructor(private http: HttpClient) {
  }

  requestFeedList(tag: string = null): Observable<any> {
    if (this.feedList) {
      if (!tag || tag === '') {
        return of(this.feedList)
          .pipe(map(list => this.sortSeedListByDate(list)));
      } else {
        return of(this.feedList)
          .pipe(
            map((list: FeedModel[]) => list.filter((feed: FeedModel) => {
              return feed.tags && feed.tags.includes(tag);
            })),
            map(list => {
              return this.sortSeedListByDate(list);
            })
          );
      }
    } else {
      const params = new HttpParams().set('timestamp', Date.now().toString());
      return this.http.get(`${environment.domain}/feed/list`, {params})
        .pipe(
          map(v => this.sortSeedListByDate(v as FeedModel[])),
          tap((list: FeedModel[]) => {
            this.feedList = list || [];
          }),
          flatMap(v => this.requestFeedList(tag)),
          catchError(this.handleError('requestFeedList', []))
        );
    }
  }

  requestSeedContent(id: string): Observable<any> {
    const params = new HttpParams().set('timestamp', Date.now().toString());
    return this.http.get(`${environment.domain}/md/${id}`, {responseType: 'text', params: params})
      .pipe(
        tap(console.log),
        catchError(this.handleError('requestSeedContent', null))
      );
  }

  reqestAboutMe(): Observable<any> {
    const params = new HttpParams().set('timestamp', Date.now().toString());
    return this.http.get(`${environment.domain}/md/about-me-content`, {responseType: 'text', params: params})
      .pipe(
        tap(console.log),
        catchError(this.handleError('reqestAboutMe', null))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(operation, error);
      return of(result as T);
    };
  }

  private sortSeedListByDate(list: FeedModel[]): FeedModel[] {
    return list.sort((a: FeedModel, b: FeedModel) => {
      return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
    });
  }

  findNav(id: string): Observable<{ previous: FeedModel; next: FeedModel }> {
    return Observable.create(obs => {
      let result = null;
      for (const k in this.seedCache) {
        const list = this.sortSeedListByDate(this.seedCache[k]);
        list.forEach((seed: FeedModel, index: number) => {
          if (seed.id === id) {
            result = {
              previous: list[index - 1],
              next: list[index + 1]
            };
          }
        });
        if (result) {
          break;
        }
      }
      obs.next(result);
      obs.complete();
    });
  }
}
