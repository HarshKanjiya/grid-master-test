import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from '@angular/common';
import { Component, computed, input, model, signal } from '@angular/core';
import { CopyPasteDirective } from "../../directives/copyPaste.directive";
import { DoubleClickDirective } from '../../directives/double-click.directive';
import { ICell, IHeaderCell, IRow } from '../../types/interfaces';

@Component({
  selector: 'grid-master',
  standalone: true,
  imports: [CommonModule, ScrollingModule, DoubleClickDirective, CopyPasteDirective],
  templateUrl: './grid-master.component.html',
  styleUrl: './grid-master.component.css'
})
export class GridMaster {
  rowCount = input<number>(100);
  colCount = input<number>(100);
  cellHeight = input<number>(30);
  cellWidth = input<number>(100);

  virtualScrolling = input<boolean>(true);

  dataType = input<"JSON" | "GRID" | "CSV">("JSON");
  data = model<IRow[]>([]);

  horizontalHeader = input<boolean>(false);
  verticalHeader = input<boolean>(false);
  horizontalHeaderData = input<IHeaderCell[]>([]);
  verticalHeaderData = input<IHeaderCell[]>([]);

  hHeaderData = computed(() => {
    const inputData = this.horizontalHeaderData();
    if (inputData?.length > 0) return inputData;
    else return Array.from({ length: 26 }, (_, i) => ({ label: String.fromCharCode(65 + i) }));
  });

  vHeaderData = computed(() => {
    const inputData = this.verticalHeaderData();
    if (inputData?.length > 0) return inputData;
    else return Array.from({ length: this.rowCount() }, (_, i) => ({ label: i + 1 }));
  });


  selectedCells: ICell[] = [];
  selectedRow: number = -1;
  selectedCol: number = -1;
  selectionStart = signal<{ row: number, col: number } | null>(null);
  selectionEnd = signal<{ row: number, col: number } | null>(null);
  isSelecting = signal(false);

  constructor() { }

  onRowSelect(rowIndex: number) {
    this.selectedRow = rowIndex;
    this.selectedCol = -1;
  }
  onColumnSelect(cellIndex: number) {
    this.selectedCol = cellIndex;
    this.selectedRow = -1;
  }

  selectAll() {

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

  isSelected(row: number, col: number): boolean {
    const start = this.selectionStart();
    const end = this.selectionEnd();
    if (!start || !end) return false;

    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);

    return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
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
      row.forEach((cell: ICell) => temp.push(cell.value ?? ""))
      dataString = dataString + temp.join('\t')
      // if (row.length > ind) dataString = dataString + "\n";
      dataString = dataString + "\n";
    })

    return dataString
  }


  onCellPaste(pastedData: string) {
    if (!pastedData?.length) return

    if (JSON.stringify(pastedData).slice(-3) == '\\n"') {
      pastedData = pastedData.slice(0, -3);
    }

    let valueArr: string[][] = pastedData.split("\n").map((row: string) => row.split("\t"));

    const rowIndex = this.selectionStart()?.row;
    const colIndex = this.selectionEnd()?.col;

    if (!rowIndex && !colIndex && rowIndex != 0 && colIndex != 0) return

    valueArr.forEach((valRow: string[], valRowInd) => {
      valRow.forEach((val: string, valColInd: number) => {
        // @ts-ignore
        this.data()[valRowInd + rowIndex].cells[valColInd + colIndex].value = val;
      })
    })


  }

}


