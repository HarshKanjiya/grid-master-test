import { Component, input, model, output } from '@angular/core';
import { IHeaderCell, IRow } from '../types/interfaces';

@Component({
  selector: 'grid-master',
  standalone: true,
  imports: [],
  templateUrl: './grid-master.component.html',
  styleUrl: './grid-master.component.css'
})
export class GridMaster {
  rowCount = input<number>(100);
  colCount = input<number>(100);
  cellHeight = input<number>(30);
  cellWidth = input<number>(100);

  virtualScrolling = input<boolean>(true);
  horizontalHeader = input<boolean>(true);
  verticalHeader = input<boolean>(true);
  horizontalHeaderData = input<IHeaderCell[]>([]);
  verticalHeaderData = input<IHeaderCell[]>([]);




  dataType = input<"JSON" | "GRID" | "CSV">("JSON");
  data = model<IRow[]>([]);
}
