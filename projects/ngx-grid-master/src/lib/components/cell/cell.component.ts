import { Component, computed, effect, ElementRef, input, model, ViewChild } from '@angular/core';
import { ICell, IHeaderCell } from '../../types/interfaces';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'grid-cell',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})
export class CellComponent {

  @ViewChild('inputElement') inputElement?: ElementRef;
  cell = model<any>();
  currentCell = input<IHeaderCell>();
  focused = input<boolean>();

  constructor() {
    effect(() => {
      if (this.focused() && this.inputElement) this.inputElement.nativeElement.focus();
    })
  }

  saveValue(event: any) {
    this.cell.set(event.target.value)
  }
}
