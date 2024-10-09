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

  colCount = computed(() => this.horizontalHeaderData().length);
  rowCount = computed(() => this.data().length);

  selectedCells: { row: number, col: number }[] = [];
  cellValueString: string = "";
  selectedRow: number = -1;
  selectedCol: number = -1;
  selectionStart = signal<{ row: number, col: number } | null>(null);
  selectionEnd = signal<{ row: number, col: number } | null>(null);
  isSelecting = signal(false);

  selectedCell: ICell | null = null;

  constructor() { }

  ngOnInit(): void {
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
    this.getSelectedCells();
  }
  onColumnSelect(colIndex: number) {
    this.selectedCol = colIndex;
    this.selectedRow = -1;
    this.selectionStart.set({ row: 0, col: colIndex })
    this.selectionEnd.set({ row: this.rowCount(), col: colIndex })
    this.getSelectedCells();
  }

  selectAll() {
    this.selectionStart.set({ row: 0, col: 0 });
    this.selectionEnd.set({ row: this.rowCount(), col: this.colCount() });
  }

  onMouseDown(event: MouseEvent, row: number, col: number) {
    this.selectedCells = [{ row, col }];
    this.selectionStart.set({ row, col });
    this.selectionEnd.set({ row, col });
    this.isSelecting.set(true);
  }

  onMouseEnter(event: MouseEvent, row: number, col: number) {
    if (this.isSelecting()) {
      this.selectedCells.push({ row, col })
      this.selectionEnd.set({ row, col });
    }
  }

  onMouseUp() {
    this.isSelecting.set(false);
    this.getSelectedCells();

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

    if (row >= minRow && row <= maxRow && col >= minCol && col <= maxCol) {
      classes.push('selected-cell');
      if (row === minRow) classes.push('selected-cell-top');
      if (row === maxRow) classes.push('selected-cell-bottom');
      if (col === minCol) classes.push('selected-cell-left');
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

    let rows: ICell[][] = this.data().slice(minRow, maxRow + 1)
    let cols = this.horizontalHeaderData().slice(minCol, maxCol + 1).map((x) => x.field)

    let values: string[] = []

    rows.forEach((row: any) => {
      let rowVals: string[] = [];
      cols.forEach((field: string) => {
        rowVals.push(row[field])
      })
      values.push(rowVals.join("\t"))
    })

    this.cellValueString = values.join("\n")
  }

  onCellPaste(pastedData: string) {
    if (!pastedData?.length) return

    let valueArr: string[][] = pastedData.split(/\r?\n/).map((row: string) => row.split("\t"));

    const rowIndex = this.selectionStart()?.row ?? -1;
    const colIndex = this.selectionEnd()?.col ?? -1;

    if (rowIndex < 0 || colIndex < 0) return
    valueArr.forEach((valRow: string[], valRowInd) => {
      valRow.forEach((val: string, valColInd: number) => {
        const row = valRowInd + rowIndex;
        const col = valColInd + colIndex;
        this.data()[row][this.horizontalHeaderData()[col].field] = val;
        console.log({ row: row, col: col, newValue: val });
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

  cellValueChange(e: any) {
    const obj = { row: this.selectedCells[0].row, col: this.selectedCells[0].col, newValue: e };
    console.log(obj);
  }
}


