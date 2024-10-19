import { DatePipe } from '@angular/common';
import { Component, effect, ElementRef, input, model, output, ViewChild } from '@angular/core';
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
  @ViewChild('checkboxElement') checkboxElement?: ElementRef;

  cell = model<any>();
  currentCell = input<IHeaderCell>();
  focused = input<boolean>();
  onchange = output<{ oldValue: any, newValue: any }>();

  oldValue: any = null;
  currentValue: any = '';

  constructor() {
    effect(() => {
      if (this.focused() && this.inputElement) this.inputElement.nativeElement.focus();
      if (this.focused() && this.checkboxElement) this.checkboxElement.nativeElement.focus();
      this.currentValue = this.cell();
      this.oldValue = this.cell();
    })
  }

  ngOnInit() { }

  saveValue(changedValue: any) {
    if ((!this.oldValue && !changedValue) || (this.oldValue == changedValue)) return
    this.cell.set(changedValue);
    this.onchange.emit({ oldValue: this.oldValue, newValue: changedValue })
  }
}
