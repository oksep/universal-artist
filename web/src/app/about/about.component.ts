import {Component, OnInit} from '@angular/core';
import {AppService} from '../app.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  content: '';

  constructor(private service: AppService) {
  }

  ngOnInit() {
    this.service.reqestAboutMe()
      .subscribe(content => {
        this.content = content || '';
      });
  }

}
