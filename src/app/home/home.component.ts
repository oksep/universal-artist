import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {HomeService, ImageItem} from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  data: Array<ImageItem> = [];

  sub = null;

  constructor(private cdRef: ChangeDetectorRef, private homeService: HomeService) {
  }

  ngOnInit(): void {
    this.sub = this.homeService.bucketObservable.subscribe(
      (list: Array<ImageItem>) => {
        this.data = list;
        this.cdRef.detectChanges();
      },
      error => {
        this.data = [];
        console.error(error);
      }
    );
  }

  ngOnDestroy() {
    if (this.sub != null) {
      this.sub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
  }

  onImgClick(key: string) {
    const url = environment.domain + key;
    this.homeService.openUrlInBrowser(url);
  }

  onSortClick() {
    this.homeService.changeOrder();
  }

  get order() {
    return this.homeService.order;
  }
}
