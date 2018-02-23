import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgModel} from '@angular/forms';
import {UploadService} from './upload.service';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss'],
  providers: [NgModel]
})
export class UploadButtonComponent implements OnInit {

  @ViewChild('fileUpload') fileUpload: ElementRef;

  constructor(private uploadService: UploadService) {
  }

  ngOnInit(): void {
  }

  onUploadClick() {
    // this.homeService.getUploadToken();
    this.fileUpload.nativeElement.click();
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
    this.uploadService.upload1By1(imageFiles);
  }
}
