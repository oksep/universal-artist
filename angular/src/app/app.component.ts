import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedIndex: Number = 0;

  navs = [
    {router: '/bed', name: 'ImageHost'},
    {router: '/brand', name: 'Brand'},
    {router: '/illustration', name: 'Illustration'},
    {router: '/home', name: 'Ui/Ux'},
    {router: '/setting', name: 'Setting'},
  ];

  constructor() {
  }
}
