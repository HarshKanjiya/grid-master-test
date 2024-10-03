import { Component, input, model } from '@angular/core';
import { IHeaderCell, IRow } from '../../types/interfaces';
import { ScrollingModule } from "@angular/cdk/scrolling"

@Component({
  selector: 'grid-master',
  standalone: true,
  imports: [ScrollingModule],
  templateUrl: './grid-master.component.html',
  styleUrl: './grid-master.component.css'
})
export class GridMaster {
  rowCount = input<number>(100);
  colCount = input<number>(100);
  cellHeight = input<number>(30);
  cellWidth = input<number>(100);

  virtualScrolling = input<boolean>(true);
  horizontalHeader = input<boolean>(false);
  verticalHeader = input<boolean>(false);
  horizontalHeaderData = input<IHeaderCell[]>([]);
  verticalHeaderData = input<IHeaderCell[]>([]);




  dataType = input<"JSON" | "GRID" | "CSV">("JSON");
  data = model<IRow[]>([]);
}
