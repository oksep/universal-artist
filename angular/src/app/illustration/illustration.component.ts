import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-illustration',
  templateUrl: './illustration.component.html',
  styleUrls: ['./illustration.component.scss']
})
export class IllustrationComponent implements OnInit {

	tiles = [
		{text: 'One', cols: 1, rows: 1, color: 'rgba(72,221,172,0.6)'},
		{text: 'Two', cols: 1, rows: 1, color: 'rgba(72,221,172,0.6)'},
		{text: 'Three', cols: 1, rows: 1, color: 'rgba(72,221,172,0.6)'},
		{text: 'Four', cols: 3, rows: 2, color: 'rgba(72,221,172,0.6)'},
	];

  constructor() { }

  ngOnInit() {
  }

}
