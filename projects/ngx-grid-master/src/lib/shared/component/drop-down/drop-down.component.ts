import { trigger, transition, style, animate } from '@angular/animations';
import { Component, ElementRef, HostListener, input, model, output, Output, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'custom-drop-down',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './drop-down.component.html',
  styleUrl: './drop-down.component.css',
  animations: [
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "scale(0.97)" }),
        animate(
          "150ms ease-in-out",
          style({ opacity: 1, transform: "scale(1)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "scale(1)" }),
        animate(
          "1000ms ease-in-out",
          style({ opacity: 0, transform: "scale(0.97)" })
        )
      ])
    ])
  ]
})
export class DropDownComponent {

  // interations
  items = input<any[]>([]);
  bindValue = input<string | null>(null);
  bindLabel = input<string | null>(null);
  selectMultiple = input<boolean>(false);
  virtualScroll = input<boolean>(true);
  allowClear = input<boolean>(true);
  allowSearch = input<boolean>(true);
  onChange = output<any>();
  placeholder = input<string>("Select item")
  model = model();
  // internal use
  isOpen = signal<boolean>(false);
  searchText = '';
  selectedItems: any[] = [];
  selectedItem: object | string | null = null;
  visibleItems: any[] = [];

  @ViewChild('dropdownContainer') dropdownElement!: ElementRef<HTMLDivElement>;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.dropdownElement.nativeElement.contains(event.target as Node)) this.toggle()
    else this.isOpen.set(false);
  }

  toggle() {
    this.isOpen.set(!this.isOpen());
    if (!this.isOpen()) {
      this.searchText = '';
      this.filterItems();
    }
  }

  selectItem(item: any) {
    if (this.selectMultiple()) {
      // const index = this.selectedItems.findIndex(i => i[this.bindValue()] === item[this.bindValue()]);
      // if (index !== -1) {
      //   this.selectedItems.splice(index, 1);
      // } else {
      //   this.selectedItems.push(item);
      // }
    } else {
      this.selectedItem = item;
      let value = this.bindValue() ? item[this.bindValue()] : this.selectedItem;
      this.onChange.emit(value);
      this.model.set(value);
      this.toggle();
    }
  }

  filterItems() {
    this.visibleItems = this.items().filter(item => (
      this.bindValue() ?
        item[this.bindValue()]?.toLowerCase()?.includes(this.searchText.toLowerCase()) :
        item?.toLowerCase()?.includes(this.searchText.toLowerCase())
    ));
  }

  clearSelection() {
    this.selectedItem = null;
    this.selectedItems = null;
    this.model.set(null);
    this.onChange.emit(this.selectedItem);
  }

}
