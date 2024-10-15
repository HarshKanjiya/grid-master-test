import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-virtual-scroll-viewport',
  templateUrl: './virtual-scroll-viewport.component.html',
  styleUrls: ['./virtual-scroll-viewport.component.css'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: VirtualScrollViewportComponent, multi: true }],
  standalone: true,
  imports: [CommonModule]
})
export class VirtualScrollViewportComponent implements AfterViewInit {
  @Input() items: any[] = []; // Full item list
  @Input() virtualScroll: boolean = false; // Flag for virtual scroll
  @Input() itemSize: number = 25; // Height or size of each item in the viewport
  visibleItems: any[] = []; // Items that are currently visible in the viewport
  totalItemsHeight: number = 0; // Total height of all items (for scrollbar)
  viewportHeight: number = 800; // Height of the viewport (visible area)
  startIndex: number = 0; // Start index of the visible items
  endIndex: number = 0; // End index of the visible items

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    if (this.virtualScroll) {
      //this.viewportHeight = this.el.nativeElement.clientHeight; // Get the height of the viewport
      this.calculateVisibleItems(); // Calculate initially visible items
      this.cdr.detectChanges();
    } else {
      this.visibleItems = this.items; // Display all items if virtual scroll is disabled
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    if (this.virtualScroll) {
      this.calculateVisibleItems();
    }
  }

  private calculateVisibleItems(): void {
    const scrollTop = this.el.nativeElement.scrollTop; // Get the current scroll position
    this.startIndex = Math.floor(scrollTop / this.itemSize); // Calculate start index
    const viewportItemCount = Math.ceil(this.viewportHeight / this.itemSize); // How many items fit in the viewport
    this.endIndex = this.startIndex + viewportItemCount; // Calculate end index
    this.visibleItems = this.items.slice(this.startIndex, this.endIndex); // Get the visible items

    this.totalItemsHeight = this.items.length * this.itemSize; // Total height for scrollbar
  }
}
