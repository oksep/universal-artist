import {Component, Input, OnInit} from '@angular/core';
import {FeedModel} from '../feed.model';

@Component({
  selector: 'app-feed-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  @Input() feed: FeedModel;

  constructor() {
  }

  ngOnInit() {
  }
}
