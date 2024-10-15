import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, EventEmitter, forwardRef, HostListener, Input, model, OnInit, Output, Renderer2 } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-select',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
  }],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SelectComponent implements ControlValueAccessor, OnInit {
  @Input() options: Array<any> = [];
  @Input() multiple: boolean = false;
  @Input() placeholder: string = null;
  @Input() searchable: boolean = false;
  @Input() clearable: boolean = false;
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;

  // Dynamic optionValue and optionLabel
  @Input() optionValue: string = null;
  @Input() optionLabel: string = null;

  // bind value
  model = model<any>();

  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  @Output() searchChange: EventEmitter<string> = new EventEmitter();

  searchTerm$ = new Subject<string>();
  filteredOptions: Array<any> = [];
  selectedValue: any[] = [];

  defaultSelectedValue = computed(() => {
    const _values = this.model();
    if (_values) {
      if (this.multiple) {
        return _values.length ? `${_values.length} selected` : this.placeholder;
      }

      return this.optionValue ? this.options.find(option => option[this.optionValue] === _values) : this.options.find(option => option === _values)
    }
    else return this.placeholder;
  });

  isOpen = false;
  searchQuery = '';
  dropdownSubscription!: Subscription;

  constructor(
    private dropdownStateService: CommonService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.searchTerm$.pipe(
      debounceTime(300)
    ).subscribe(searchTerm => {
      this.searchChange.emit(searchTerm);
      this.filterOptions(searchTerm);
    });
  }

  ngOnInit(): void {
    this.filteredOptions = [...this.options];

    // Listen to other dropdowns' state
    this.dropdownSubscription = this.dropdownStateService.getDropdownState().subscribe(currentDropdown => {
      if (currentDropdown !== this) {
        this.isOpen = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.dropdownSubscription.unsubscribe();
  }

  writeValue(value: any): void {
    if (this.multiple) {
      this.selectedValue = value || [];
    } else {
      this.selectedValue = value ? [value] : [];
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange = (value: any) => { };
  onTouched = () => { };

  toggleDropdown() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        // Notify other dropdowns to close
        this.dropdownStateService.closeAllDropdowns(this);
        this.appendDropdownToBody(); // Append dropdown to body
      } else {
        this.removeDropdownFromBody();
      }
    }
  }

  selectOption(option: any) {
    if (this.multiple) {
      const index = this.selectedValue.findIndex(val => val === option[this.optionValue]);
      if (index >= 0) {
        this.selectedValue.splice(index, 1);
      } else {
        this.selectedValue.push(option[this.optionValue]);
      }
    } else {
      this.selectedValue = [option[this.optionValue] || option];
      this.isOpen = false;
      this.removeDropdownFromBody();
    }
    this.onChange(this.multiple ? this.selectedValue : this.selectedValue[0]);
    this.selectionChange.emit(this.multiple ? this.selectedValue : this.selectedValue[0]);
  }

  isSelected(option: any): boolean {
    return this.selectedValue.includes(option[this.optionValue]);
  }

  onSearch(query: string) {
    this.searchTerm$.next(query);
  }

  filterOptions(query: string) {
    if (!query) {
      this.filteredOptions = [...this.options];
    } else {
      this.filteredOptions = this.options.filter(option =>
        option[this.optionLabel].toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  clearSelection() {
    this.selectedValue = [];
    this.onChange(this.multiple ? [] : null);
    this.selectionChange.emit(this.multiple ? [] : null);
  }

  // getSelectedText() {
  //   if (this.multiple) {
  //     return this.selectedValue.length ? `${this.selectedValue.length} selected` : this.placeholder;
  //   }
  //   return this.selectedValue.length ? this.options.find(option => option[this.optionValue] === this.selectedValue[0])?.[this.optionLabel] : this.placeholder;
  // }

  appendDropdownToBody() {
    const dropdownElement = this.elementRef.nativeElement.querySelector('.custom-select-dropdown');
    if (dropdownElement) {
      this.renderer.appendChild(document.body, dropdownElement);
      this.positionDropdown(dropdownElement);
    }
  }

  removeDropdownFromBody() {
    const dropdownElement = this.elementRef.nativeElement.querySelector('.custom-select-dropdown');
    if (dropdownElement) {
      this.renderer.removeChild(document.body, dropdownElement);
    }
  }

  positionDropdown(dropdownElement: HTMLElement) {
    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(dropdownElement, 'position', 'absolute');
    this.renderer.setStyle(dropdownElement, 'top', `${rect.bottom}px`);
    this.renderer.setStyle(dropdownElement, 'left', `${rect.left}px`);
    this.renderer.setStyle(dropdownElement, 'width', `${rect.width}px`);
  }

  @HostListener('window:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.removeDropdownFromBody();
    }
  }
}
