import { Component, computed, effect, ElementRef, input, model, ViewChild } from '@angular/core';
import { ICell } from '../../types/interfaces';
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
  cell = model<ICell>();
  focused = input<boolean>();
  constructor() {
    effect(() => {
      if (this.focused() && this.inputElement) this.inputElement.nativeElement.focus();
    })
  }

  saveValue(event: any) {
    let _cell = this.cell();
    this.cell.set({ ..._cell, value: event.target.value, type: _cell?.type ?? "TEXT" })
  }
}
