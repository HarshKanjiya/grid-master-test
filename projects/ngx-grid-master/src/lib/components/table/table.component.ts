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
  items: any[][] = []; // Two-dimensional array for 100,000 rows and 35 columns
  visibleItems = model<Array<any>>();
  itemHeight = 30; // Height of each row
  viewportHeight = 600; // Height of the visible area
  startIndex = 0;
  endIndex = 0;

  @ViewChild('viewport') viewport: ElementRef;

  private scrollSubject = new Subject<any>(); // Subject for scroll event

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {
    // Initialize items with mock data
    this.items = Array.from({ length: 100000 }, (_, rowIndex) =>
      Array.from({ length: 35 }, (_, colIndex) => `Row ${rowIndex + 1} Col ${colIndex + 1}`)
    );

    // Set up the debounce for the scroll event
    this.scrollSubject.pipe(debounceTime(20)).subscribe(event => {
      this.onScroll(event);
    });
  }
  scrollHeight = 0;
  ngOnInit() {
    this.scrollHeight = this.visibleItems.length * this.itemHeight;
    console.log('scrollHeight:', this.scrollHeight);
    this.calculateVisibleItems();
  }

  ngAfterViewInit() {
    this.viewport.nativeElement.addEventListener('scroll', (event) => {
      this.scrollSubject.next(event);
    });
  }

  onScroll(event: any) {
    const scrollTop = event.target.scrollTop;
    this.startIndex = Math.floor(scrollTop / this.itemHeight);
    console.log('startIndex:', this.startIndex);
    this.calculateVisibleItems();
  }

  calculateVisibleItems() {
    const visibleCount = Math.ceil(this.viewportHeight / this.itemHeight) + 1; // Add one extra row for smooth scrolling
    this.endIndex = Math.min(this.startIndex + visibleCount, this.items.length);
    console.log('endIndex:', this.endIndex);
    this.visibleItems.set(this.items.slice(this.startIndex, this.endIndex));
    console.log('visibleItems:', this.visibleItems);
  }

  trackItem(index: number, item: any) {
    return index; // or item.id, if you have a unique id for each item
  }
}
