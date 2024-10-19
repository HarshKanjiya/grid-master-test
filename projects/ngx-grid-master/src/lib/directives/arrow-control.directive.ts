import { Directive, HostListener, output } from '@angular/core';

@Directive({
  selector: '[arrowControl]',
  standalone: true
})
export class ArrowControlDirective {

  arrowUp = output<boolean>();
  arrowDown = output<boolean>();
  arrowLeft = output<boolean>();
  arrowRight = output<boolean>();

  constructor() { }

  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart;

    switch (event.key) {
      case 'ArrowUp':
        this.arrowUp.emit(true);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.arrowDown.emit(true);
        break;
      case 'ArrowLeft':
        if (event.target['readOnly'] || !cursorPosition || cursorPosition === 0) {
          event.preventDefault();
          this.arrowLeft.emit(true);
        }
        break;
      case 'ArrowRight':
        if (cursorPosition === input.value?.length) {
          event.preventDefault();
          this.arrowRight.emit(true);
        }
        break;
      default:
        break;
    }
  }

}
