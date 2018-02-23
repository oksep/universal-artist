import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {NgModel} from '@angular/forms';
import {CurrentUploadFile, SingleFileCallback, UploadService} from './upload.service';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss'],
  providers: [NgModel]
})
export class UploadButtonComponent implements OnInit, SingleFileCallback {
  @ViewChild('fileUpload') fileUploadInput: ElementRef;

  uploadFile = new CurrentUploadFile();

  constructor(private uploadService: UploadService, private zone: NgZone) {
  }

  ngOnInit(): void {
  }

  onUploadClick() {
    // this.homeService.getUploadToken();
    this.fileUploadInput.nativeElement.click();
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
    this.uploadService.upload1By1(imageFiles, this);
  }

  onProgress(file: File, percent: number) {
    this.zone.run(() => {
      if (file) {
        this.uploadFile.file = file;
        this.uploadFile.progress = percent;
      } else {
        // setTimeout(() => {
        //   this.uploadFile.file = null;
        //   this.uploadFile.progress = 0;
        // }, 1000);
      }
    });
  }
}
