import { Directive, HostListener, input, output } from '@angular/core';

@Directive({
  selector: '[copyPaste]',
  standalone: true
})
export class CopyPasteDirective {

  copyData = input<any>()
  onPaste = output<string>();

  constructor() { }

  @HostListener('document:copy', ['$event'])
  onCopyEvent(event: ClipboardEvent) {
    if (this.copyData()) {
      event.preventDefault();
      event.clipboardData?.setData('text/plain', this.copyData());
    }
  }

  @HostListener('document:paste', ['$event'])
  onPasteEvent(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text/plain');
    if (clipboardData) {
      const pastedData = clipboardData;
      this.onPaste.emit(pastedData);
    }
  }

}
