import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedIndex: Number = 0;

  navs = [
    {router: '/bed', name: 'BED'},
    {router: '/brand', name: 'BRAND'},
    {router: '/illustration', name: 'ILLUSTRATION'},
    {router: '/home', name: 'HOME'},
    {router: '/setting', name: 'SETTING'},
  ];

  constructor() {
  }

  onRouterClick(i: number) {
    this.selectedIndex = i;
    console.log('selected index: ', i);
  }
}
