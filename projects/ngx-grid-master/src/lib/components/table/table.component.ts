import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, input, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ArrowControlDirective } from '../../directives/arrow-control.directive';
import { CommonService } from '../../shared/services/common.service';
import { CopyPasteDirective2 } from './directives/copyPaste.directive';
import { CellComponent } from '../cell/cell.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, CellComponent, CopyPasteDirective2, ArrowControlDirective]
})
export class TableComponent {
  isLoading = input<boolean>(false);
  @Input() columns = [];
  @Input() sampleData = [];

  visibleRowsCount = 20; // Number of visible rows at a time
  visibleColumnsCount = 10; // Number of visible columns at a time
  rowHeight = 30; // Row height in pixels
  colWidth = 100; // Column width in pixels
  totalHeight = (this.sampleData.length || 100) * this.rowHeight;
  totalWidth = (this.columns.length || 20) * this.colWidth;

  startRowIndex = 0;
  startColIndex = 0;
  visibleRows = [];

  selectionStart = { row: -1, col: -1 };
  selectionEnd = { row: -1, col: -1 };
  isSelecting = false;

  selectedCell = { row: -1, col: -1 }
  // columns = Array.from({ length: this.totalColumns }, (_, i) => ({ width:150 })); // Predefined columns

  /* columns = [
    { "label": "A", "width": "100" },
    { "label": "B", "width": "120" },
    { "label": "C", "width": "150" },
    { "label": "D", "width": "110" },
    { "label": "E", "width": "140" },
    { "label": "F", "width": "130" },
    { "label": "G", "width": "160" },
    { "label": "H", "width": "170" },
    { "label": "I", "width": "180" },
    { "label": "J", "width": "190" },
    { "label": "K", "width": "200" },
    { "label": "L", "width": "220" },
    { "label": "M", "width": "210" },
    { "label": "N", "width": "230" },
    { "label": "O", "width": "240" },
    { "label": "P", "width": "250" },
    { "label": "Q", "width": "260" },
    { "label": "R", "width": "270" },
    { "label": "S", "width": "280" },
    { "label": "T", "width": "290" },
    { "label": "U", "width": "300" },
    { "label": "V", "width": "310" },
    { "label": "W", "width": "320" },
    { "label": "X", "width": "330" },
    { "label": "Y", "width": "340" },
    { "label": "Z", "width": "350" },
    { "label": "AA", "width": "360" },
    { "label": "AB", "width": "370" },
    { "label": "AC", "width": "380" },
    { "label": "AD", "width": "390" },
    { "label": "AE", "width": "400" }
  ]; */

  @ViewChild('scrollableElement') scrollableElement!: ElementRef;

  // History stacks
  undoStack: any[][] = [];
  redoStack: any[][] = [];

  @Output() afterChange = new EventEmitter<any>();
  private sortOrders: { [key: string]: 'asc' | 'desc' } = {}; // Store sort order for each column

  constructor(private _commonService: CommonService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sampleData']?.currentValue) {
      this.loadVisibleRows();
    }
  }
  // Load the visible rows based on the current scroll position
  loadVisibleRows() {
    // this.visibleRows = Array.from({ length: this.visibleRowsCount }, (_, rowIndex) =>
    //   Array.from({ length: this.totalColumns }, (_, colIndex) => `Data ${this.startRowIndex + rowIndex}, ${colIndex} `)
    // );
    this.visibleRows = [];
    for (let index = this.startRowIndex; index < this.visibleRowsCount + this.startRowIndex; index++) {
      this.visibleRows.push(this.sampleData[index]);
    }
    // debugger

  }

  // Scroll event handler for both vertical and horizontal scrolling
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    const scrollTop = event.target.scrollTop;
    const scrollLeft = event.target.scrollLeft;

    const newRowIndex = Math.floor(scrollTop / this.rowHeight);
    const newColIndex = Math.floor(scrollLeft / this.colWidth);

    if (newRowIndex !== this.startRowIndex || newColIndex !== this.startColIndex) {
      this.startRowIndex = newRowIndex;
      this.startColIndex = newColIndex;
      this.loadVisibleRows();
    }
  }

  // Calculate the transform style to position the rows properly during scroll
  getTransformStyle() {
    return `translateY(${this.scrollableElement ? this.scrollableElement.nativeElement.scrollTop : 0}px)`;
  }

  getTransformStyleForHeader() {
    return `translateX(-${this.scrollableElement ? this.scrollableElement.nativeElement.scrollLeft : 0}px)`;
  }

  trackByIndex(index: number) {
    return index;
  }

  /* sortColumn(col: string) {
    if (this.sortingColumn === col) {
      this.sortingDirection = this.sortingDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortingColumn = col;
      this.sortingDirection = 'asc';
    }

    this.data.sort((a, b) => {
      const valA = a[col];
      const valB = b[col];
      if (valA < valB) return this.sortingDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortingDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updateVisibleRows(this.visibleRange.start);
  } */


  onMouseDown(row: number, col: number) {
    // this.selectedCells = [{ row, col }];
    this.selectionStart = { row, col };
    this.selectionEnd = { row, col };
    this.isSelecting = true
  }

  onMouseEnter(row: number, col: number) {
    if (this.isSelecting) {
      this.selectionEnd = { row, col };
    }
  }

  onMouseUp() {
    this.isSelecting = false;
    // if (this.scrollInterval) {
    //   clearInterval(this.scrollInterval);
    //   this.scrollInterval = null;
    // }
    cancelAnimationFrame(this.scrollAnimationFrame);

  }

  selectCell(row, col) {
    this.selectedCell.row = row;
    this.selectedCell.col = col;
  }

  isCellSelected(row: number, col: number): boolean {
    const start = this.selectionStart;
    const end = this.selectionEnd;
    if (!start || !end) return false;

    return row == start.row && start.row == end.row && col == start.col && start.col == end.col;
  }

  lastMouseX = 0;
  lastMouseY = 0;

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isSelecting) return;

    const container: HTMLElement = this.scrollableElement.nativeElement;
    const { top, bottom, left, right } = container.getBoundingClientRect();
    const edgeMargin = 80;  // Distance from edge where scrolling should start

    if (event.clientY > bottom - edgeMargin) {
      this.scrollDirection = 'down';
    } else if (event.clientY < top + edgeMargin) {
      this.scrollDirection = 'up';
    } else if (event.clientX > right - edgeMargin) {
      this.scrollDirection = 'right';
    } else if (event.clientX < left + edgeMargin) {
      this.scrollDirection = 'left';
    } else {
      this.scrollDirection = '';
    }
    if (this.scrollDirection) {
      this.startAutoScroll();
    } else {
      cancelAnimationFrame(this.scrollAnimationFrame);
      this.scrollAnimationFrame = null;
    }
  }


  scrollSpeed: number = 50;
  scrollInterval: any;
  scrollDirection: string = '';
  scrollAnimationFrame: any;

  startAutoScroll() {
    if (this.scrollAnimationFrame) return;  // Prevent multiple scroll triggers

    const scrollStep = () => {
      const container: HTMLElement = this.scrollableElement.nativeElement;

      if (this.scrollDirection === 'down') {
        container.scrollTop += this.scrollSpeed;
      } else if (this.scrollDirection === 'up') {
        container.scrollTop -= this.scrollSpeed;
      } else if (this.scrollDirection === 'right') {
        container.scrollLeft += this.scrollSpeed;
      } else if (this.scrollDirection === 'left') {
        container.scrollLeft -= this.scrollSpeed;
      }

      // Continue the scroll if still in a scroll zone
      if (this.scrollDirection) {
        this.scrollAnimationFrame = requestAnimationFrame(scrollStep);
      }
    };

    this.scrollAnimationFrame = requestAnimationFrame(scrollStep);
  }


  // checkMousePosition(event: MouseEvent) {
  //   if (!this.isSelecting) return;

  //   const mouseX = event.clientX;
  //   const mouseY = event.clientY;

  //   // Get the dimensions of the scrollable element
  //   const rect = this.scrollableElement?.nativeElement.getBoundingClientRect();
  //   const width = rect?.width;
  //   const height = rect?.height;

  //   // Calculate the differences
  //   const diffX = mouseX - this.lastMouseX;
  //   const diffY = mouseY - this.lastMouseY;

  //   // Determine direction
  //   let dir = "";
  //   if (Math.abs(diffX) > Math.abs(diffY)) {
  //     dir = diffX > 0 ? "RIGHT" : "LEFT";
  //   } else {
  //     dir = diffY > 0 ? "DOWN" : "TOP";
  //   }

  //   // Check for mouse position relative to the scrollable element
  //   const isNearRight = width && (mouseX - rect.left >= width - 100);
  //   const isNearLeft = width && (mouseX - rect.left <= 100);
  //   const isNearBottom = height && (mouseY - rect.top >= height - 100);
  //   const isNearTop = height && (mouseY - rect.top <= 100);

  //   // Perform scrolling based on direction and proximity to edges
  //   if (isNearRight && dir === "RIGHT") {
  //     this.scrollableElement.nativeElement?.scrollBy({
  //       top: 0,
  //       left: 100,
  //       behavior: 'smooth'
  //     });
  //   } else if (isNearBottom && dir === "DOWN") {
  //     this.scrollableElement.nativeElement?.scrollBy({
  //       top: 100,
  //       left: 0,
  //       behavior: 'smooth'
  //     });
  //   } else if (isNearLeft && dir === "LEFT") {
  //     this.scrollableElement.nativeElement?.scrollBy({
  //       top: 0,
  //       left: -100,
  //       behavior: 'smooth'
  //     });
  //   } else if (isNearTop && dir === "TOP") {
  //     this.scrollableElement.nativeElement?.scrollBy({
  //       top: -100,
  //       left: 0,
  //       behavior: 'smooth'
  //     });
  //   }

  //   // Update the last mouse position
  //   this.lastMouseX = mouseX;
  //   this.lastMouseY = mouseY;
  // }

  isSelected(row: number, col: number): string {

    const start = this.selectionStart;
    const end = this.selectionEnd;
    if (start.col < 0 || start.row < 0) return "";

    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);

    let classes = [];

    if (row >= minRow && row <= maxRow && col >= minCol && col <= maxCol) {
      classes.push('selected-cell');
      if (row === minRow) classes.push('selected-cell-top');
      if (row === maxRow) classes.push('selected-cell-bottom');
      if (col === minCol) classes.push('selected-cell-left');
      if (col === maxCol) classes.push('selected-cell-right');
    }

    return classes.join(' ');
  }

  onCellPaste(pastedData: string) {
    if (!pastedData?.length) return

    let valueArr: string[][] = pastedData.split(/\r?\n/).map((row: string) => row.split("\t"));

    const start = this.selectionStart;
    const end = this.selectionEnd;

    if ((start.row ?? -1) < 0 || (end.col ?? -1) < 0) return

    const sliceArray = [];

    for (let valRowInd = 0; valRowInd < valueArr.length; valRowInd++) {
      const valRow = valueArr[valRowInd];
      for (let valColInd = 0; valColInd < valRow.length; valColInd++) {
        const val = valRow[valColInd];
        const row = valRowInd + start.row;
        const col = valColInd + start.col;
        const history = {
          row: row,
          col: col,
          oldValue: this.sampleData[row][this.columns[col].field],
          newValue: val
        };

        sliceArray.push(history);
        this.sampleData[row][this.columns[col].field] = val;
      }
    }
    this.undoStack.push(sliceArray);
    this.redoStack = [];

    this.selectionEnd = { row: sliceArray[sliceArray?.length - 1].row, col: sliceArray[sliceArray?.length - 1].col };
    console.log(sliceArray);

  }

  onArrowDown() {
    let row = this.selectionStart?.row ?? 0;
    let col = this.selectionStart?.col ?? 0;
    let newRow = row < this.sampleData?.length ? row + 1 : this.sampleData?.length;
    this.selectedCell = this.selectionStart = this.selectionEnd = { row: newRow, col: col };
  }

  onArrowUp() {
    let row = this.selectionStart?.row ?? 0;
    let col = this.selectionStart?.col ?? 0;
    let newRow = row > 0 ? row - 1 : 0;
    this.selectedCell = this.selectionStart = this.selectionEnd = { row: newRow, col: col };
  }

  onArrowLeft() {
    let row = this.selectionStart?.row ?? 0;
    let col = this.selectionStart?.col ?? 0;
    let newCol = col > 0 ? col - 1 : 0;
    this.selectedCell = this.selectionStart = this.selectionEnd = { row: row, col: newCol };
  }

  onArrowRight() {
    let row = this.selectionStart?.row ?? 0;
    let col = this.selectionStart?.col ?? 0;
    let newCol = col < this.columns?.length ? col + 1 : this.columns?.length;
    this.selectedCell = this.selectionStart = this.selectionEnd = { row: row, col: newCol };
  }

  //#region undo redo
  // Handle keyboard events for undo/redo
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
      // Ctrl+Z (or Cmd+Z on Mac) for undo
      event.preventDefault();  // Prevent default browser undo behavior
      this.undo();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
      // Ctrl+Y (or Cmd+Y on Mac) for redo
      event.preventDefault();  // Prevent default browser redo behavior
      this.redo();
    }
  }

  saveHistory(params) {
    this.undoStack.push([params]);
    this.redoStack = [];
    this.afterChange.emit(params);
  }

  undo() {
    if (this.undoStack?.length) {
      const lastState = this.undoStack.pop();
      if (lastState.length) {
        this.redoStack.push(lastState);
        this.setUndoRedoData("UNDO", lastState);
      }
    }
  }

  redo() {
    if (this.redoStack?.length) {
      const nextState = this.redoStack.pop();
      if (nextState.length) {
        this.undoStack.push(nextState);
        this.setUndoRedoData("REDO", nextState);
      }
    }
  }

  setUndoRedoData(type: "UNDO" | "REDO", slice: { row: number, col: number, oldValue: any, newValue: any }[]) {
    // console.log(slice);

    slice.forEach((change) => {
      this.setDataAtCell(change.row, change.col, type == "UNDO" ? change.oldValue : change.newValue);
    })
    this.selectionStart = this.selectedCell = { row: slice[0].row, col: slice[0].col };
    this.selectionEnd = { row: slice[slice.length - 1].row, col: slice[slice.length - 1].col };
  }

  canUndo() {
    return this.undoStack.length > 1;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  //#endregion

  //#region column wise sorting
  sortItems(cellIndex) {
    const columnKey = this.columns[cellIndex].field;
    if (!this.sortOrders[columnKey]) {
      this.sortOrders[columnKey] = 'asc';
    }

    this.sortOrders[columnKey] = this.sortOrders[columnKey] === 'asc' ? 'desc' : 'asc';

    const sortingData = this._commonService.sortByKey(this.sampleData, columnKey, this.sortOrders[columnKey]);
    this.sampleData = JSON.parse(JSON.stringify(sortingData));
  }
  //#endregion


  //#region set data at a cell
  setDataAtCell(rowIndex, colIndex, value) {
    this.sampleData[rowIndex][this.columns[colIndex].field] = value;
  }
  //#endregion

  //#region randomly column width set base on data
  // colGroups = [];

  // calculateColumnWidths(): void {
  //   const baseWidthPerChar = 10; // Reduced to make widths more reasonable
  //   const minDateFieldWidth = 120;

  //   this.colGroups = this.columns?.map(col => {
  //     // Determine the max length between the column label and its row data
  //     const maxLength = Math.max(
  //       col.label.length,
  //       ...this.visibleRows?.map(row => {
  //         const value = String(row[col.field] || ''); // Handle null/undefined data gracefully
  //         return value.length;
  //       })
  //     );

  //     // Base width on the maximum content length (characters) multiplied by width per character
  //     let width = maxLength * baseWidthPerChar;

  //     // If the column type is date, enforce a minimum width for date fields
  //     if (/date/i.test(col.type)) {
  //       width = Math.max(minDateFieldWidth, width);
  //     }

  //     // Return the width for each column
  //     return {
  //       width: width
  //     };
  //   });
  // }

}
