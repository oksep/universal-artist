import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {UploadFile, UploadFileStatus, UploadService} from '../../shared/upload.service';

@Component({
  selector: 'app-upload-status',
  templateUrl: './upload-status.component.html',
  styleUrls: ['./upload-status.component.scss']
})
export class UploadStatusComponent implements OnInit, OnDestroy, AfterViewInit {

  sub = null;

  data: Array<UploadFile> = [];

  constructor(private uploadService: UploadService, private cdRef: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.sub = this.uploadService.uploadFileObservable.subscribe(
      (list: Array<UploadFile>) => {
        this.data = list.filter((uploadFile) => uploadFile.status == UploadFileStatus.UPLOADING);
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

}
