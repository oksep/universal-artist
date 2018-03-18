import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {CommonService, ImageItem} from '../shared/common.service';
import {UploadService} from '../shared/upload.service';

@Component({
  selector: 'app-bed',
  templateUrl: './bed.component.html',
  styleUrls: ['./bed.component.scss']
})
export class BedComponent implements OnInit, OnDestroy, AfterViewInit {

  data: Array<ImageItem> = [];

  sub = null;

  text = 0;

  constructor(private cdRef: ChangeDetectorRef, private homeService: CommonService, private uploadService: UploadService) {
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

  showButton = true;

  ngAfterViewInit(): void {
    const element = document.getElementById('scroll-content');
    let preScrollTop = 0;
    element.addEventListener('scroll', () => {
      this.showButton = preScrollTop < element.scrollTop;
      preScrollTop = element.scrollTop;
    });
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

  handleInputChange(e: DragEvent) {
    const selectFiles = e.dataTransfer ? e.dataTransfer.files : (<HTMLInputElement>e.target).files;
    const imageFiles = [];
    for (const key of Object.keys(selectFiles)) {
      const file = selectFiles[key];
      if (file.type.startsWith('image/')) {
        imageFiles.push(file);
      }
    }
    console.log(imageFiles);
    this.uploadService.uploadFiles(imageFiles);
  }
}
