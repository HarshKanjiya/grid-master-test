import { Directive, HostListener, input, output } from '@angular/core';

@Directive({
  selector: '[copyPaste]',
  standalone: true
})
export class CopyPasteDirective2 {

  data = input<any>();
  columns = input<any>();
  start = input<{ row: number, col: number }>();
  end = input<{ row: number, col: number }>();

  onPaste = output<string>();

  constructor() { }

  @HostListener('document:copy', ['$event'])
  onCopyEvent(event: ClipboardEvent) {
    let str = this.getSelectedCells();
    if (str) {
      event.preventDefault();
      event.clipboardData?.setData('text/plain', str);
    }
  }

  getSelectedCells(): string {
    if (this.start().col < 0 || this.start().row < 0) return null;

    const minRow = Math.min(this.start().row, this.end().row);
    const maxRow = Math.max(this.start().row, this.end().row);
    const minCol = Math.min(this.start().col, this.end().col);
    const maxCol = Math.max(this.start().col, this.end().col);

    let rows: any[][] = this.data().slice(minRow, maxRow + 1)
    let cols = this.columns().slice(minCol, maxCol + 1).map((x) => x.field)

    let values: string[] = []

    rows.forEach((row: any) => {
      let rowVals: string[] = [];
      cols.forEach((field: string) => {
        rowVals.push(row[field])
      })
      values.push(rowVals.join("\t"))
    })

    return values.join("\n")
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
