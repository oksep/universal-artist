import {Component} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  currentUrl: string;

  links = ['home', 'shop', 'about', 'contact'];

  constructor(private router: Router) {
    this.router.events.subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.currentUrl = (value as NavigationEnd).url;
      }
    });
  }

  onActivate(event: any) {
    window.scrollTo(0, 0);
  }

  onNavClick(link: string) {
    this.router.navigate([link]).then(() => {
    });
  }
}
