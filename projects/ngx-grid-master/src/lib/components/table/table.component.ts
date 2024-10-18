// table.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, model, NgZone, signal, ViewChild } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class TableComponent {
  items: string[][] = [];
  visibleItems: string[][] = [];
  visibleColumns: number[] = [];
  itemHeight: number = 50; // Fixed height for each row
  itemWidth: number = 150; // Fixed width for each column
  buffer: number = 10; // Buffer rows and columns for smooth scrolling
  containerHeight: number = 500; // Fixed container height
  containerWidth: number = 1200; // Fixed container width for horizontal scrolling
  totalHeight: number = 0;
  totalWidth: number = 0;
  startRowIndex: number = 0;
  endRowIndex: number = 0;
  startColIndex: number = 0;
  endColIndex: number = 0;
  totalRows: number = 100000;
  totalCols: number = 30;

  ngOnInit(): void {
    // Create 100,000 rows and 30 columns with dummy data
    this.items = Array.from({ length: this.totalRows }, (_, rowIndex) =>
      Array.from({ length: this.totalCols }, (_, colIndex) => `Row ${rowIndex} - Col ${colIndex}`)
    );
    this.totalHeight = this.items.length * this.itemHeight;
    this.totalWidth = this.totalCols * this.itemWidth;

    this.calculateVisibleItems();
  }

  // Handle scrolling
  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
    this.calculateVisibleItems(event.target.scrollTop, event.target.scrollLeft);
  }

  calculateVisibleItems(scrollTop: number = 0, scrollLeft: number = 0): void {
    // Calculate visible rows
    this.startRowIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.buffer);
    this.endRowIndex = Math.min(this.items.length - 1, Math.ceil((scrollTop + this.containerHeight) / this.itemHeight) + this.buffer);

    // Calculate visible columns
    this.startColIndex = Math.max(0, Math.floor(scrollLeft / this.itemWidth) - this.buffer);
    this.endColIndex = Math.min(this.totalCols - 1, Math.ceil((scrollLeft + this.containerWidth) / this.itemWidth) + this.buffer);

    // Get visible rows and columns slice
    this.visibleItems = [];

    for (let i = this.startRowIndex; i <= this.endRowIndex; i++) {
      const visibleRow = [];
      const row = this.items[i];

      for (let j = this.startColIndex; j <= this.endColIndex; j++) {
        visibleRow.push(row[j]);
      }

      this.visibleItems.push(visibleRow);
    }


    this.visibleColumns = Array.from({ length: this.endColIndex - this.startColIndex + 1 }, (_, i) => this.startColIndex + i);
  }

  getTransformStyle(): string {
    return `translateY(${this.startRowIndex * this.itemHeight}px) translateX(${this.startColIndex * this.itemWidth}px)`;
  }

  trackByIndex(index: number): number {
    return index;
  }

  colGroups = [];
  calculateColumnWidths(): void {
    const baseWidthPerChar = 15;
    const minDateFieldWidth = 120;
    
    this.colGroups = this.visibleColumns.map(col => {
      // Calculate the maximum length of content in the column
      const maxLength = Math.max(
        ...this.items.map(row => String(row[col]).length),
        col.toString()?.length
      );

      // If the column is a date field, apply the minimum width of 100px
      let width = maxLength * baseWidthPerChar;

      // Return the width for each column
      return {
        width: width
      };
    });
  }
}
