import { DatePipe } from '@angular/common';
import { Component, effect, ElementRef, input, model, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomDatePickerComponent } from '../../shared/component/custom-date-picker/custom-date-picker.component';
import { IHeaderCell } from '../../types/interfaces';
import { DropDownComponent } from '../../shared/component/drop-down/drop-down.component';

@Component({
  selector: 'grid-cell',
  standalone: true,
  imports: [FormsModule, DatePipe, CustomDatePickerComponent, DropDownComponent],
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
