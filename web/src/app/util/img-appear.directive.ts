import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appImgAppear]'
})
export class ImgAppearDirective {

  constructor(private elementRef: ElementRef, private render: Renderer2) {
    this.render.setStyle(this.elementRef.nativeElement, 'opacity', '0');
  }

  @HostListener('load')
  onImgLoad() {
    this.render.setStyle(this.elementRef.nativeElement, 'padding', '0');
    this.render.setStyle(this.elementRef.nativeElement, 'opacity', '1');
  }

}
