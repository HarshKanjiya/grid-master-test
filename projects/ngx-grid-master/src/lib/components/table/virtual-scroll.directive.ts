import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  HostListener,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges
} from '@angular/core';

@Directive({
  selector: '[virtualScroll]',
  standalone: true
})
export class VirtualScrollDirective implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() virtualScroll = false;
  @Input() virtualScrollItemSize = 46; // Default item size
  @Input() items: any[] = []; // Input for items from the component

  private totalHeight = 0;
  private scrollListener: () => void;

  constructor(private el: ElementRef, private renderer: Renderer2, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.virtualScroll) {
      this.updateTotalHeight();
      this.setTableHeight();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items'] && this.virtualScroll) {
      this.updateTotalHeight();
      this.renderRows(); // Re-render rows when items change
    }
  }

  ngAfterViewInit() {
    this.renderRows();
    this.scrollListener = this.renderer.listen(this.el.nativeElement, 'scroll', () => this.renderRows());
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      this.scrollListener();
    }
  }

  private updateTotalHeight() {
    this.totalHeight = this.items.length * this.virtualScrollItemSize;
    this.setTableHeight();
  }

  private setTableHeight() {
    this.renderer.setStyle(this.el.nativeElement, 'height', `${this.totalHeight}px`);
  }

  private renderRows() {
    const container = this.el.nativeElement;
    const scrollTop = container.scrollTop;

    // Calculate the start and end index based on the current scroll position
    const startIdx = Math.max(0, Math.floor(scrollTop / this.virtualScrollItemSize));
    const endIdx = Math.min(this.items.length, Math.ceil((scrollTop + container.clientHeight) / this.virtualScrollItemSize));

    // Clear previously rendered rows
    this.clearTable();

    // Render only the visible rows
    for (let i = startIdx; i < endIdx; i++) {
      const rowElement = this.createRow(this.items[i]);
      this.renderer.setStyle(rowElement, 'top', `${i * this.virtualScrollItemSize}px`);
      this.renderer.appendChild(container.querySelector('tbody'), rowElement);
    }
  }

  private createRow(data: any): HTMLElement {
    const row = this.renderer.createElement('tr');
    for (const key of Object.keys(data)) {
      const cell = this.renderer.createElement('td');
      const text = this.renderer.createText(data[key]);
      this.renderer.appendChild(cell, text);
      this.renderer.appendChild(row, cell);
    }
    return row;
  }

  private clearTable() {
    const tbody = this.el.nativeElement.querySelector('tbody');
    while (tbody.firstChild) {
      this.renderer.removeChild(tbody, tbody.firstChild);
    }
  }
}
