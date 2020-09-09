import {Directive, ElementRef, HostListener, Renderer2} from '@angular/core';

@Directive({
  selector: '[appTouchHover]'
})
export class TouchHoverDirective {

  constructor(private ref: ElementRef, private render: Renderer2) {
  }

  @HostListener('touchstart')
  onTouchStart() {
    this.render.setStyle(this.ref.nativeElement, 'opacity', '1');
  }

  @HostListener('touchend')
  onTouchEnd() {
    this.render.setStyle(this.ref.nativeElement, 'opacity', '0');
  }

  @HostListener('touchcancel')
  onTouchCancel() {
    this.render.setStyle(this.ref.nativeElement, 'opacity', '0');
  }
}
