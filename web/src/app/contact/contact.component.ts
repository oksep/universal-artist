import {Component, OnInit} from '@angular/core';
import {Util} from '../util/util';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  toEmail = 'zhongyanbenny@gmail.com';
  weixin = '17321398188';

  fromEmail = '';
  subject = '';
  body = '';

  constructor() {
  }

  ngOnInit() {
  }

  onSendEmailClick() {
    const url = Util.getMailtoUrl(this.toEmail, this.subject, this.body);
    window.open(url, '_self');
  }
}
