import { Directive, HostListener, output } from '@angular/core';

@Directive({
  selector: '[doubleClick]',
  standalone: true
})
export class DoubleClickDirective {

  constructor() { }

  onDoubleClick = output<void>();

  @HostListener('dblclick', ['$event'])
  onDoubleClickFunc(event: Event): void {
    this.onDoubleClick.emit();
  }

}
