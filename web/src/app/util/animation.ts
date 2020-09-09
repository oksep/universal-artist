import {animate, style, transition, trigger} from '@angular/animations';

export default class AnimateHelper {
  static fadeInOut = trigger('fadeInOut', [
    transition(':enter', [
      style({
        opacity: 0
      }),
      animate('0.25s ease-in-out', style({
        opacity: 1
      }))
    ]),
    transition(':leave', [
      style({
        opacity: 1
      }),
      animate('0.25s ease-in-out', style({
        opacity: 0
      }))
    ])
  ]);
}