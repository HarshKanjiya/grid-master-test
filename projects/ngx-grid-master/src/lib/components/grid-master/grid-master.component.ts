import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from '@angular/common';
import { Component, computed, input, model, signal } from '@angular/core';
import { ArrowControlDirective } from "../../directives/arrow-control.directive";
import { CopyPasteDirective } from "../../directives/copyPaste.directive";
import { DoubleClickDirective } from '../../directives/double-click.directive';
import { ICell, IHeaderCell } from '../../types/interfaces';
import { CellComponent } from "../cell/cell.component";

@Component({
  selector: 'grid-master',
  standalone: true,
  imports: [
    CommonModule,
    ScrollingModule,
    DoubleClickDirective,
    CopyPasteDirective,
    ArrowControlDirective,

    CellComponent
  ],
  templateUrl: './grid-master.component.html',
  styleUrls: ['./grid-master.component.css', "./classes.css"]
})
export class GridMaster {
  cellHeight = input<number>(20);
  cellWidth = input<number>(100);

  virtualScrolling = input<boolean>(true);

  dataType = input<"JSON" | "GRID" | "CSV">("JSON");
  data = model<any[]>([]);

  allowStyling = input<boolean>(false);
  horizontalHeader = input<boolean>(false);
  verticalHeader = input<boolean>(false);
  horizontalHeaderData = input<IHeaderCell[]>([]);
  verticalHeaderData = input<IHeaderCell[]>([]);

  hHeaderData = computed(() => {
    const inputData = this.horizontalHeaderData();
    if (inputData?.length > 0) return inputData;
    else return Array.from({ length: 26 }, (_, i) => ({ label: String.fromCharCode(65 + i), width: this.cellWidth() }));
  });

  vHeaderData = computed(() => {
    const inputData = this.verticalHeaderData();
    if (inputData?.length > 0) return inputData;
    else return Array.from({ length: this.rowCount() }, (_, i) => ({ label: i + 1, height: this.cellHeight() }));
  });

  rowCount = computed(() => this.data().length);
  colCount = computed(() => this.horizontalHeaderData().length);

  selectedCells: ICell[] = [];
  selectedRow: number = -1;
  selectedCol: number = -1;
  selectionStart = signal<{ row: number, col: number } | null>(null);
  selectionEnd = signal<{ row: number, col: number } | null>(null);
  isSelecting = signal(false);

  selectedCell: ICell | null = null;

  constructor() { }

  ngOnInit(): void {
    /* for (let x = 0; x < this.colCount(); x++) {
      if (!this.data()[x]) this.data()[x] = { cells: [] }
      for (let y = 0; y < this.rowCount(); y++) {
        if (!this.data()[x].cells[y]) this.data()[x].cells[y] = this.getDefaultCell("");
      }
    } */

    let _temp = this.data();
    for (let i = 0; i < this.rowCount(); i++) {
      if (_temp[i] == undefined) _temp[i] = {};
      this.horizontalHeaderData().map((x => {
        if (_temp[i][x.field] == undefined) _temp[i][x.field] = "";
      }))
    }
    this.data.set(_temp);
  }

  onRowSelect(rowIndex: number) {
    this.selectedRow = rowIndex;
    this.selectedCol = -1;
    this.selectionStart.set({ row: rowIndex, col: 0 })
    this.selectionEnd.set({ row: rowIndex, col: this.colCount() })
  }
  onColumnSelect(colIndex: number) {
    this.selectedCol = colIndex;
    this.selectedRow = -1;
    this.selectionStart.set({ row: 0, col: colIndex })
    this.selectionEnd.set({ row: this.rowCount(), col: colIndex })
  }

  selectAll() {
    this.selectionStart.set({ row: 0, col: 0 });
    this.selectionEnd.set({ row: this.rowCount(), col: this.colCount() });
  }

  onMouseDown(event: MouseEvent, row: number, col: number) {
    this.selectionStart.set({ row, col });
    this.selectionEnd.set({ row, col });
    this.isSelecting.set(true);
  }

  onMouseEnter(event: MouseEvent, row: number, col: number) {
    if (this.isSelecting()) {
      this.selectionEnd.set({ row, col });
    }
  }

  onMouseUp() {
    this.isSelecting.set(false);
  }

  isCellSelected(row: number, col: number): boolean {
    const start = this.selectionStart();
    const end = this.selectionEnd();
    if (!start || !end) return false;

    return row == start.row && start.row == end.row && col == start.col && start.col == end.col;
  }

  isSelected(row: number, col: number): string {
    const start = this.selectionStart();
    const end = this.selectionEnd();
    if (!start || !end) return "";

    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);

    let classes = [];

    // If the cell is within the selected range
    if (row >= minRow && row <= maxRow && col >= minCol && col <= maxCol) {
      classes.push('selected-cell');

      // Apply border on the top if it's the top-most row
      if (row === minRow) classes.push('selected-cell-top');

      // Apply border on the bottom if it's the bottom-most row
      if (row === maxRow) classes.push('selected-cell-bottom');

      // Apply border on the left if it's the left-most column
      if (col === minCol) classes.push('selected-cell-left');

      // Apply border on the right if it's the right-most column
      if (col === maxCol) classes.push('selected-cell-right');
    }

    return classes.join(' ');
  }

  getSelectedCells(): any {
    const start = this.selectionStart();
    const end = this.selectionEnd();
    if (!start || !end) return [];

    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);

    let cellData: ICell[][] = this.data().slice(minRow, maxRow + 1).map(row => row.cells.slice(minCol, maxCol + 1));

    let dataString: string = "";
    cellData.forEach((row: ICell[], ind) => {
      let temp: string[] = [];
      row.forEach((cell: ICell) => temp.push(cell.value ?? null))
      dataString = dataString + temp.join('\t')
      if (ind < cellData.length - 1) {
        dataString += "\n";
      }
    })

    return dataString
  }


  onCellPaste(pastedData: string) {
    if (!pastedData?.length) return

    if (JSON.stringify(pastedData).slice(-3) == '\\n"') {
      pastedData = pastedData.slice(0, -3);
    }

    let valueArr: string[][] = pastedData.split("\n").map((row: string) => row.split("\t"));

    const rowIndex = this.selectionStart()?.row ?? -1;
    const colIndex = this.selectionEnd()?.col ?? -1;

    if (rowIndex < 0 || colIndex < 0) return
    valueArr.forEach((valRow: string[], valRowInd) => {
      valRow.forEach((val: string, valColInd: number) => {
        if (this.data()[valRowInd + rowIndex].cells[valColInd + colIndex]) this.data()[valRowInd + rowIndex].cells[valColInd + colIndex].value = val;
        else this.data()[valRowInd + rowIndex].cells[valColInd + colIndex] = this.getDefaultCell(val)
      })
    });
  }

  getDefaultCell(value: string): ICell {
    return {
      type: "TEXT",
      value: value
    }
  }

  selectCell(cell: ICell) {
    this.selectedCell = cell
  }

  onArrowDown() {
    let row = this.selectionStart()?.row ?? 0;
    let col = this.selectionStart()?.col ?? 0;
    let newRow = row < this.rowCount() ? row + 1 : this.rowCount();
    this.selectionStart.set({ row: newRow, col: col })
    this.selectionEnd.set({ row: newRow, col: col })
  }

  onArrowUp() {
    let row = this.selectionStart()?.row ?? 0;
    let col = this.selectionStart()?.col ?? 0;
    let newRow = row > 0 ? row - 1 : 0;
    this.selectionStart.set({ row: newRow, col: col })
    this.selectionEnd.set({ row: newRow, col: col })
  }

  onArrowLeft() {
    let row = this.selectionStart()?.row ?? 0;
    let col = this.selectionStart()?.col ?? 0;
    let newCol = col > 0 ? col - 1 : 0;
    this.selectionStart.set({ row: row, col: newCol })
    this.selectionEnd.set({ row: row, col: newCol })
  }

  onArrowRight() {
    let row = this.selectionStart()?.row ?? 0;
    let col = this.selectionStart()?.col ?? 0;
    let newCol = col < this.colCount() ? col + 1 : this.colCount();
    this.selectionStart.set({ row: row, col: newCol })
    this.selectionEnd.set({ row: row, col: newCol })
  }

}


