import { Component, computed, effect, ElementRef, input, model, ViewChild } from '@angular/core';
import { ICell, IHeaderCell } from '../../types/interfaces';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'grid-cell',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})
export class CellComponent {

  @ViewChild('inputElement') inputElement?: ElementRef;
  cell = model<any>();
  currentCell = input<IHeaderCell>();
  focused = input<boolean>();

  currentValue: any;

  constructor() {
    effect(() => {
      if (this.focused() && this.inputElement) this.inputElement.nativeElement.focus();
    })
  }

  ngOnInit() {
    this.currentValue = this.cell();
  }

  saveValue(changedValue: any) {
    this.cell.set(changedValue);
  }
}
