import { Component, effect, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IHeaderCell } from '../../types/interfaces';

@Component({
  selector: 'header-cell',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './header-cell.component.html',
  styleUrl: './header-cell.component.css'
})
export class HeaderCellComponent {
  data = model<IHeaderCell>();
  isAllSelected = input<boolean>(false);
  isSomeSelected = input<boolean>(false);
  onSortItems = output<any>();
  selectDeselectAll = output<{ field: string, value: boolean }>();

  checkBoxModel: boolean = false;

  constructor() {
    effect(() => {
      this.checkBoxModel = this.isAllSelected();
    })
  }

  onCheckboxChange() {
    this.selectDeselectAll.emit({ field: this.data().field, value: this.checkBoxModel })
  }

  sortItems() {
    this.onSortItems.emit(this.data().field);
  }

  ngOnInit() {
  }
}
