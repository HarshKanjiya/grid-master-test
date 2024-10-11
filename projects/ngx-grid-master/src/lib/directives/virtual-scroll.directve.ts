import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appVirtualScrollTable]',
    standalone: true
})
export class VirtualScrollTableDirective implements OnInit {
    @Input() virtualScroll: boolean = true;
    @Input() virtualScrollItemSize: number = 25;
    @Input() items: any[] = [];

    private scrollIndex = 0;
    private scrollBuffer = 0;
    private minBufferPx: number = 100;
    private maxBufferPx: number = 200;

    constructor(private elRef: ElementRef) { }

    ngOnInit() {
        if (!this.virtualScroll) {
            return;
        }

        this.elRef.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    }

    ngOnDestroy() {
        if (!this.virtualScroll) {
            return;
        }

        this.elRef.nativeElement.removeEventListener('scroll', this.onScroll);
    }

    onScroll() {
        if (!this.virtualScroll) {
            return;
        }

        const scrollTop = this.elRef.nativeElement.scrollTop;
        this.scrollBuffer = scrollTop - this.scrollIndex * this.virtualScrollItemSize;

        this.updateScrollIndex();
        this.adjustScrollBuffer();
    }

    private updateScrollIndex() {
        if (!this.virtualScroll) {
            return;
        }

        const newScrollIndex = Math.floor(this.scrollBuffer / this.virtualScrollItemSize);

        if (newScrollIndex !== this.scrollIndex) {
            this.scrollIndex = newScrollIndex;
            // Emit scroll index change event (if needed)
        }
    }

    private adjustScrollBuffer() {
        if (!this.virtualScroll) {
            return;
        }

        if (this.scrollBuffer < this.minBufferPx) {
            this.elRef.nativeElement.scrollTop = this.scrollIndex * this.virtualScrollItemSize + this.minBufferPx;
        } else if (this.scrollBuffer > this.maxBufferPx) {
            this.elRef.nativeElement.scrollTop = this.scrollIndex * this.virtualScrollItemSize + this.maxBufferPx;
        }
    }
}