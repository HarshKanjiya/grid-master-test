import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, HostListener, input, model, signal } from '@angular/core';
import { ArrowControlDirective } from "../../directives/arrow-control.directive";
import { CopyPasteDirective } from "../../directives/copyPaste.directive";
import { DoubleClickDirective } from '../../directives/double-click.directive';
import { VirtualScrollViewportComponent } from "../../shared/component/virtual-scroll-viewport/virtual-scroll-viewport.component";
import { CommonService } from "../../shared/services/common.service";
import { ICell, IHeaderCell } from '../../types/interfaces';
import { CellComponent } from "../cell/cell.component";
import { HeaderCellComponent } from "../header-cell/header-cell.component";

@Component({
  selector: 'grid-master',
  standalone: true,
  imports: [
    CommonModule,
    ScrollingModule,
    DoubleClickDirective,
    CopyPasteDirective,
    ArrowControlDirective,
    VirtualScrollViewportComponent,
    CellComponent,
    HeaderCellComponent
  ],
  templateUrl: './grid-master.component.html',
  styleUrls: ['./grid-master.component.css', "./classes.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridMaster {
  isLoading = input<boolean>(false);

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
    else return Array.from({ length: 26 }, (_, i) => ({ label: String.fromCharCode(65 + i), type: "TEXT", field: "", width: this.cellWidth() }));
  });

  vHeaderData = computed(() => {
    const inputData = this.verticalHeaderData();
    if (inputData?.length > 0) return inputData;
    else return Array.from({ length: this.rowCount() }, (_, i) => ({ label: i + 1, height: this.cellHeight() }));
  });

  colCount = computed(() => this.horizontalHeaderData().length);
  rowCount = computed(() => this.data().length || 100);

  selectedCells: { row: number, col: number }[] = [];
  cellValueString: string = "";
  selectedRow: number = -1;
  selectedCol: number = -1;
  selectionStart = signal<{ row: number, col: number } | null>(null);
  selectionEnd = signal<{ row: number, col: number } | null>(null);
  isSelecting = signal(false);

  selectedCell: ICell | null = null;

  private sortOrders: { [key: string]: 'asc' | 'desc' } = {}; // Store sort order for each column
  colGroups = [];

  /* changes: { row: number, col: number, value: any }[] = [];
  changesIndex: number = 0; */
  // History stacks
  history: any[][][] = [];
  future: any[][][] = [];

  constructor(private _commonService: CommonService) {
  }

  ngOnInit(): void {
    let _temp = this.data();
    for (let i = 0; i < this.rowCount(); i++) {
      if (_temp[i] == undefined) _temp[i] = {};
      this.horizontalHeaderData().map((x => {
        if (_temp[i][x.field] == undefined) _temp[i][x.field] = "";
      }))
    }
    this.data.set(_temp);
    this.calculateColumnWidths();
  }

  /* ngOnChanges(changes: SimpleChanges) {
    this.isLoading = changes['isLoading'].currentValue;
  } */

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
    const start = this.selectionStart();
    const end = this.selectionEnd();

    if (start.row == end.row && start.col == end.col) {
      // paste everything
      valueArr.forEach((valRow: string[], valRowInd) => {
        valRow.forEach((val: string, valColInd: number) => {
          const row = valRowInd + start.row;
          const col = valColInd + start.col;
          const emitObject = { row: row, col: col, oldValue: this.data()[row][this.horizontalHeaderData()[col].field], newValue: val };
          this.data()[row][this.horizontalHeaderData()[col].field] = val;
          this.saveHistory(emitObject);
        })
      });
    } else {
      // paste in selected cells
      valueArr.forEach((valRow: string[], valRowInd) => {
        valRow.forEach((val: string, valColInd: number) => {
          const row = valRowInd + start.row;
          const col = valColInd + start.col;
          if (row > end.row || col > end.col) return
          const emitObject = { row: row, col: col, oldValue: this.data()[row][this.horizontalHeaderData()[col].field], newValue: val };
          this.data()[row][this.horizontalHeaderData()[col].field] = val;
          this.saveHistory(emitObject);
        })
      });
    }
  }

  getDefaultCell(value: string): ICell {
    return {
      type: "TEXT",
      value: value
    }
  }

  selectCell(cell: ICell) {
    this.selectedCell = cell;
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

  cellValueChange(newValue: any, rowIndex: number, colIndex: number) {
    const obj = { row: rowIndex, col: colIndex, newValue: newValue };

    /* if (this.changesIndex < this.changes.length) {
      if (this.changesIndex) {
        this.changes.splice(this.changesIndex, this.changes.length - this.changesIndex - 1)
      }
    }
    this.changes.push(JSON.parse(JSON.stringify(obj)));
    console.log("changes", this.changes);

    this.changesIndex = this.changes.length - 1; */
    // Save the current state to history and clear future stack
    this.saveHistory(obj);
    this.future = []; // Clear redo stack when a new edit is made
    console.log(obj);
  }

  //#region undo redo
  saveHistory(params) {
    this.history.push(JSON.parse(JSON.stringify(params)));
  }

  undo() {
    if (this.history.length > 0) {
      const lastState = this.history.pop();
      if (lastState) this.future.push(lastState);
      const { row, col, oldValue, newValue } = JSON.parse(JSON.stringify(this.history[this.history.length - 1]))
      /* this.data()[row][this.horizontalHeaderData()[col].field] = oldValue; */
      this.setDataAtCell(row, col, oldValue);
    }
  }

  redo() {
    if (this.future.length > 0) {
      const nextState = this.future.pop();
      if (nextState) {
        this.saveHistory(nextState); // Save current state before redo        
        const { row, col, newValue } = JSON.parse(JSON.stringify(nextState));
        /* this.data()[row][this.horizontalHeaderData()[col].field] = newValue; */
        this.setDataAtCell(row, col, newValue);
      }
    }
  }

  canUndo() {
    return this.history.length > 1;
  }

  canRedo() {
    return this.future.length > 0;
  }

  //#endregion

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

  //#region column wise sorting
  sortItems(cellIndex) {
    const columnKey = this.horizontalHeaderData()[cellIndex].field;
    if (!this.sortOrders[columnKey]) {
      this.sortOrders[columnKey] = 'asc';
    }

    this.sortOrders[columnKey] = this.sortOrders[columnKey] === 'asc' ? 'desc' : 'asc';

    const sortingData = this._commonService.sortByKey(this.data(), columnKey, this.sortOrders[columnKey]);
    this.data.set(sortingData);
  }
  //#endregion

  // header-checkbox-functions

  selectDeselectAll(data: { field: string, value: boolean }): void {
    this.data.set(
      this.data().map((row) => {
        row[data.field] = data.value;
        return row
      })
    )
  }

  isAllSelected(field: string): boolean {
    return this.data().every((row) => row[field])
  }

  isSomeSelected(field: string): boolean {
    return this.data().some((row) => row[field])
  }

  //#region randomly column width set base on data 
  calculateColumnWidths(): void {
    const baseWidthPerChar = 15;
    const minDateFieldWidth = 120;

    this.colGroups = this.horizontalHeaderData().map(col => {
      // Calculate the maximum length of content in the column
      const maxLength = Math.max(
        ...this.data().map(row => String(row[col.field]).length),
        col.label.length
      );

      // If the column is a date field, apply the minimum width of 100px
      let width = maxLength * baseWidthPerChar;

      // Check if the column is a date field
      const regex = /\bdate\b/i;
      if (regex.test(col.type)) {
        width = Math.max(minDateFieldWidth, width);
      }

      // Return the width for each column
      return {
        width: width
      };
    });
  }

  setDataAtCell(rowIndex, colIndex, value) {    
    this.data()[rowIndex][this.horizontalHeaderData()[colIndex].field] = value;
  }
}


