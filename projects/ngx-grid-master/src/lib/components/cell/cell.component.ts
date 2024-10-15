import { DatePipe } from '@angular/common';
import { Component, effect, ElementRef, input, model, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomDatepickerComponent } from '../../shared/component/custom-date-picker/custom-date-picker.component';
import { SelectComponent } from '../../shared/component/drop-down/drop-down.component';
import { IHeaderCell } from '../../types/interfaces';

@Component({
  selector: 'grid-cell',
  standalone: true,
  imports: [FormsModule, DatePipe, CustomDatepickerComponent, SelectComponent],
  templateUrl: './cell.component.html',
  styleUrl: './cell.component.css'
})
export class CellComponent {

  @ViewChild('inputElement') inputElement?: ElementRef;
  cell = model<any>();
  currentCell = input<IHeaderCell>();
  focused = input<boolean>();

  currentValue: any = null;

  constructor() {
    effect(() => {
      if (this.focused() && this.inputElement) this.inputElement.nativeElement.focus();
      this.currentValue = this.cell();
    })
  }

  ngOnInit() { }

  saveValue(changedValue: any) {
    this.cell.set(changedValue);
  }
}
