import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppService} from '../app.service';
import {FeedModel} from '../feed/feed.model';

@Component({
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  content: '';

  nav: { previous: FeedModel; next: FeedModel };

  constructor(private router: ActivatedRoute, private service: AppService) {
  }

  ngOnInit() {
    this.router.params.subscribe(params => {
      window.scrollTo(0, 0);
      const id = params['id'];
      this.service.requestSeedContent(id)
        .subscribe(content => {
          this.content = content || 'Azhong 一定是偷懒忘记更新这篇文章了...';
          this.findNav(id);
        });
    });
  }

  findNav(id: string) {
    this.service.findNav(id).subscribe(nav => this.nav = nav);
  }

}
